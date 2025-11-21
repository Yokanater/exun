"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Panel } from "@/components/common/Panel";
import styles from "./dashboard.module.scss";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [ownedUnits, setOwnedUnits] = useState<any[]>([]);
  const [ownedOrgans, setOwnedOrgans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [sellingOrganId, setSellingOrganId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      const unitsRes = await fetch("/api/biounits");
      const unitsData = await unitsRes.json();
      const units = Array.isArray(unitsData.biounits) ? unitsData.biounits : [];
      setOwnedUnits(units.filter((unit: any) => unit.ownerId === userData.user.id));

      const organsRes = await fetch("/api/organs");
      if (organsRes.ok) {
        const organsData = await organsRes.json();
        const organs = Array.isArray(organsData.organs) ? organsData.organs : [];
        const userId = userData.user.id.toString();
        const userOrgans = organs.filter((organ: any) => organ.ownerId?.toString() === userId);
        console.log("User ID:", userId);
        console.log("All organs:", organs.length);
        console.log("User organs:", userOrgans.length);
        setOwnedOrgans(userOrgans);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSell = async (unitId: string, finalPrice: number) => {
    if (!confirm(`Sell this subject for €${Math.floor(finalPrice * 0.8).toLocaleString('en-US')}?`)) {
      return;
    }

    setSellingId(unitId);
    try {
      const response = await fetch(`/api/biounits/${unitId}/sell`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Sold for €${data.soldFor.toLocaleString('en-US')}!`);
        await fetchData(); // Refresh data
      } else {
        const data = await response.json();
        alert(data.error || "Sale failed");
      }
    } catch (error) {
      console.error(error);
      alert("Sale failed");
    } finally {
      setSellingId(null);
    }
  };

  const handleSellOrgan = async (organId: string, currentPrice: number) => {
    if (!confirm(`Sell this organ for €${Math.floor(currentPrice * 0.8).toLocaleString('en-US')}?`)) {
      return;
    }

    setSellingOrganId(organId);
    try {
      const response = await fetch(`/api/organs/${organId}/sell`, {
        method: "POST",
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Sold for €${data.soldFor.toLocaleString('en-US')}!`);
        await fetchData(); // Refresh data
      } else {
        alert(data.error || "Sale failed");
      }
    } catch (error) {
      console.error("Sell organ error:", error);
      alert("Sale failed");
    } finally {
      setSellingOrganId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <Panel>
          <p className={styles.emptyState}>Loading...</p>
        </Panel>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.balanceCard}>
        <div>
          <span className={styles.balanceLabel}>Available Balance</span>
          <h2 className={styles.balanceAmount}>€{(user.balance || 0).toLocaleString('en-US')}</h2>
        </div>
        <div className={styles.stats}>
          <div>
            <span>Owned Items</span>
            <strong>{ownedUnits.length + ownedOrgans.length}</strong>
          </div>
          <div>
            <span>Subjects</span>
            <strong>{ownedUnits.length}</strong>
          </div>
          <div>
            <span>Organs</span>
            <strong>{ownedOrgans.length}</strong>
          </div>
          <div>
            <span>Total Value</span>
            <strong>
              €{(ownedUnits.reduce((sum, unit) => sum + Math.round(unit.basePrice * unit.priceModifier), 0) + 
                 ownedOrgans.reduce((sum, organ) => sum + organ.currentPrice, 0)).toLocaleString('en-US')}
            </strong>
          </div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>My Subjects</h3>
      {ownedUnits.length === 0 ? (
        <Panel>
          <p className={styles.emptyState}>
            You don't own any items yet. Visit the marketplace to get started.
          </p>
        </Panel>
      ) : (
        <div className={styles.ownedGrid}>
          {ownedUnits.map((unit) => {
            const fallbackAvatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${unit.bioId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
            const avatarUrl = unit.generatedImageUrl || fallbackAvatarUrl;
            const finalPrice = Math.round(unit.basePrice * unit.priceModifier);
            const sellPrice = Math.floor(finalPrice * 0.8);
            const isSelling = sellingId === unit._id;

            return (
              <div key={unit.bioId} className={styles.ownedCard}>
                <img src={avatarUrl} alt={`Profile ${unit.bioId}`} className={styles.avatar} />
                <div className={styles.cardContent}>
                  <h4>Age {unit.age} • {unit.bloodType}</h4>
                  <p className={styles.bioId}>ID: {unit.bioId}</p>
                  <div className={styles.cardMetrics}>
                    <div>
                      <span>Value</span>
                      <strong>€{finalPrice.toLocaleString('en-US')}</strong>
                    </div>
                    <div>
                      <span>Athletic</span>
                      <strong>{unit.athleticRating}</strong>
                    </div>
                    <div>
                      <span>Organ Quality</span>
                      <strong>{unit.organQualityScore}</strong>
                    </div>
                  </div>
                  <div className={styles.traits}>
                    <span className={styles.trait}>{unit.healthStatus}</span>
                    <span className={styles.trait}>{unit.heightCm}cm</span>
                    <span className={styles.trait}>{unit.weightKg}kg</span>
                  </div>
                  <button
                    type="button"
                    className={styles.sellBtn}
                    onClick={() => handleSell(unit._id, finalPrice)}
                    disabled={isSelling}
                  >
                    {isSelling ? "Processing..." : `Sell for €${sellPrice.toLocaleString('en-US')}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className={styles.sectionTitle}>My Organs</h3>
      {ownedOrgans.length === 0 ? (
        <Panel>
          <p className={styles.emptyState}>
            You don't own any organs yet. Visit the organ marketplace to get started.
          </p>
        </Panel>
      ) : (
        <div className={styles.organsGrid}>
          {ownedOrgans.map((organ) => {
            const sellPrice = Math.floor(organ.currentPrice * 0.8);
            const isSellingOrgan = sellingOrganId === organ.organId;

            const organIcons: Record<string, string> = {
              heart: "❤️",
              liver: "🫀",
              kidney: "🫘",
              lung: "🫁",
              pancreas: "🥞",
              cornea: "👁️",
              skin: "🧬",
              bone_marrow: "🦴",
              small_intestine: "🌀",
              blood: "🩸",
            };

            return (
              <div key={organ.organId} className={styles.organCard}>
                <div className={styles.organIcon}>{organIcons[organ.organType] || "🔬"}</div>
                <div className={styles.organContent}>
                  <h4>{organ.organType.replace('_', ' ').toUpperCase()}</h4>
                  <p className={styles.organId}>ID: {organ.organId}</p>
                  <div className={styles.organMetrics}>
                    <div>
                      <span>Condition</span>
                      <strong>{organ.condition}</strong>
                    </div>
                    <div>
                      <span>Quality</span>
                      <strong>{organ.qualityScore}/100</strong>
                    </div>
                    <div>
                      <span>Blood Type</span>
                      <strong>{organ.bloodType}</strong>
                    </div>
                    <div>
                      <span>Value</span>
                      <strong>€{organ.currentPrice.toLocaleString('en-US')}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.sellBtn}
                    onClick={() => handleSellOrgan(organ.organId, organ.currentPrice)}
                    disabled={isSellingOrgan}
                  >
                    {isSellingOrgan ? "Processing..." : `Sell for €${sellPrice.toLocaleString('en-US')}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
