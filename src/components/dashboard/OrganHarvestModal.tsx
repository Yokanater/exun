"use client";

import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { ORGAN_LABELS } from "@/types/organ";
import { getExtractableOrgans } from "@/lib/organExtraction";
import type { BiounitRecord } from "@/lib/biounits";
import styles from "./OrganHarvestModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subject: BiounitRecord;
  onHarvestComplete: () => void;
}

export const OrganHarvestModal = ({ isOpen, onClose, subject, onHarvestComplete }: Props) => {
  const [selectedOrgans, setSelectedOrgans] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const extractableOrgans = getExtractableOrgans(
    subject.healthStatus,
    subject.organQualityScore,
    subject.athleticRating,
    subject.age
  );

  const viableOrgans = extractableOrgans.filter(o => o.canExtract);
  const totalValue = viableOrgans
    .filter(o => selectedOrgans.has(o.organType))
    .reduce((sum, o) => sum + o.estimatedPrice, 0);

  const toggleOrgan = (organType: string) => {
    const newSelected = new Set(selectedOrgans);
    if (newSelected.has(organType)) {
      newSelected.delete(organType);
    } else {
      newSelected.add(organType);
    }
    setSelectedOrgans(newSelected);
  };

  const selectAll = () => {
    setSelectedOrgans(new Set(viableOrgans.map(o => o.organType)));
  };

  const deselectAll = () => {
    setSelectedOrgans(new Set());
  };

  const handleHarvest = async () => {
    if (selectedOrgans.size === 0) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(`/api/biounits/${subject.bioId}/harvest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organTypes: Array.from(selectedOrgans),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to harvest organs');
      }

      alert(
        `Successfully harvested ${data.organs.length} organs!\n` +
        `Total Value: €${data.totalValue.toLocaleString('en-US')}`
      );

      onHarvestComplete();
      onClose();
    } catch (error) {
      console.error("Harvest failed:", error);
      alert(error instanceof Error ? error.message : 'Failed to harvest organs');
    } finally {
      setIsProcessing(false);
    }
  };

  const getHealthStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      healthy: "Optimal condition - all organs viable",
      moderate: "Moderate condition - select organs viable",
      unhealthy: "Poor condition - limited organ viability",
      deceased: "Already deceased - no viable organs",
    };
    return labels[status] || status;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Organ Extraction: ${subject.bioId}`}
      description="Select organs for harvest. Quality and pricing calculated based on subject condition."
    >
      <div className={styles.container}>
        <div className={styles.subjectInfo}>
          <div className={styles.infoGrid}>
            <div>
              <span>Age</span>
              <strong>{subject.age} years</strong>
            </div>
            <div>
              <span>Blood Type</span>
              <strong>{subject.bloodType}</strong>
            </div>
            <div>
              <span>Health Status</span>
              <strong className={styles[subject.healthStatus]}>{subject.healthStatus.toUpperCase()}</strong>
            </div>
            <div>
              <span>Organ Quality</span>
              <strong>{subject.organQualityScore}/100</strong>
            </div>
          </div>
          <p className={styles.statusNote}>{getHealthStatusLabel(subject.healthStatus)}</p>
        </div>

        {viableOrgans.length === 0 ? (
          <div className={styles.noOrgans}>
            <p>No viable organs available for extraction from this subject.</p>
            <p className={styles.hint}>Subject condition too poor for any organ harvesting.</p>
          </div>
        ) : (
          <>
            <div className={styles.actions}>
              <button type="button" onClick={selectAll} className={styles.selectBtn}>
                Select All ({viableOrgans.length})
              </button>
              <button type="button" onClick={deselectAll} className={styles.selectBtn}>
                Deselect All
              </button>
            </div>

            <div className={styles.organList}>
              {extractableOrgans.map((organ) => (
                <label
                  key={organ.organType}
                  className={`${styles.organItem} ${!organ.canExtract ? styles.disabled : ""} ${
                    selectedOrgans.has(organ.organType) ? styles.selected : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOrgans.has(organ.organType)}
                    onChange={() => toggleOrgan(organ.organType)}
                    disabled={!organ.canExtract}
                  />
                  <div className={styles.organInfo}>
                    <div className={styles.organHeader}>
                      <strong>{ORGAN_LABELS[organ.organType]}</strong>
                      {organ.canExtract && (
                        <span className={styles.quality}>Q: {organ.estimatedQuality}%</span>
                      )}
                    </div>
                    <div className={styles.organPrice}>
                      {organ.canExtract ? (
                        <span className={styles.price}>€{organ.estimatedPrice.toLocaleString()}</span>
                      ) : (
                        <span className={styles.notViable}>Not Viable</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.totalRow}>
                <span>Selected Organs:</span>
                <strong>{selectedOrgans.size}</strong>
              </div>
              <div className={styles.totalRow}>
                <span>Total Market Value:</span>
                <strong className={styles.totalPrice}>€{totalValue.toLocaleString()}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleHarvest}
              disabled={selectedOrgans.size === 0 || isProcessing}
              className={styles.harvestBtn}
            >
              {isProcessing ? "Processing..." : `Harvest ${selectedOrgans.size} Organ${selectedOrgans.size !== 1 ? "s" : ""}`}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
