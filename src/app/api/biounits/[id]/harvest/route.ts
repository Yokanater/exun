import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import { BiounitModel } from '@/models/Biounit';
import { OrganModel } from '@/models/Organ';
import { getExtractableOrgans } from '@/lib/organExtraction';
import { OrganType } from '@/types/organ';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const { organTypes } = await request.json();

    if (!Array.isArray(organTypes) || organTypes.length === 0) {
      return NextResponse.json(
        { error: 'Must select at least one organ to harvest' },
        { status: 400 }
      );
    }

    const subject = await BiounitModel.findOne({ bioId: params.id });
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    if (subject.healthStatus === 'deceased') {
      return NextResponse.json(
        { error: 'Subject is already deceased' },
        { status: 400 }
      );
    }

    const extractableOrgans = getExtractableOrgans(
      subject.healthStatus,
      subject.organQualityScore,
      subject.athleticRating,
      subject.age
    );

    const requestedOrgans = extractableOrgans.filter(
      (organ) => organTypes.includes(organ.organType) && organ.canExtract
    );

    if (requestedOrgans.length !== organTypes.length) {
      return NextResponse.json(
        { error: 'Some requested organs are not extractable from this subject' },
        { status: 400 }
      );
    }

    const getCondition = (quality: number) => {
      if (quality >= 90) return 'pristine';
      if (quality >= 75) return 'good';
      if (quality >= 50) return 'acceptable';
      if (quality >= 30) return 'marginal';
      return 'damaged';
    };

    const createdOrgans = await OrganModel.insertMany(
      requestedOrgans.map((organ) => ({
        organId: `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        organType: organ.organType,
        sourceSubjectId: subject.bioId,
        bloodType: subject.bloodType,
        condition: getCondition(organ.estimatedQuality),
        qualityScore: organ.estimatedQuality,
        baseMarketValue: organ.estimatedPrice,
        currentPrice: organ.estimatedPrice,
        isAvailable: true,
        harvestDate: new Date(),
      }))
    );

    subject.healthStatus = 'deceased';
    subject.mobilityStatus = 'sedated';
    subject.overallCondition = 'critical';
    subject.notes = `Subject terminated - ${createdOrgans.length} organs harvested`;
    await subject.save();

    const totalValue = requestedOrgans.reduce(
      (sum, organ) => sum + organ.estimatedPrice,
      0
    );

    return NextResponse.json({
      success: true,
      message: `Successfully harvested ${createdOrgans.length} organs`,
      organs: createdOrgans,
      totalValue,
      subject: {
        bioId: subject.bioId,
        healthStatus: subject.healthStatus,
      },
    });
  } catch (error) {
    console.error('Harvest error:', error);
    return NextResponse.json(
      { error: 'Failed to harvest organs' },
      { status: 500 }
    );
  }
}
