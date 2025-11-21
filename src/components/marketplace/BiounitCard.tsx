"use client";

import { useState } from "react";
import clsx from "classnames";
import type { BiounitAttributes } from "@/types/biounit";
import { useAuth } from "@/providers/AuthContext";
import styles from "./BiounitCard.module.scss";

interface Props {
  unit: BiounitAttributes & { _id?: string };
  onRefresh: () => void;
}

export const BiounitCard = ({ unit, onRefresh }: Props) => {
  const { user, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const organs = unit.availableOrgans ?? [];

  const imageUrl = (unit as any).generatedImageUrl || 
    `https://api.dicebear.com/7.x/personas/svg?seed=${unit.bioId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const finalPrice = Math.round(unit.basePrice * unit.priceModifier);
  const isOwned = unit.ownerId === user?.id;
  const isAdmin = user?.role === "admin";
  const canAfford = user && user.role !== "admin" && (user.balance || 0) >= finalPrice;

  const handlePurchase = async () => {
    if (!unit._id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/biounits/${unit._id}/purchase`, {
        method: "POST",
      });
      if (response.ok) {
        await refreshSession(); 
        onRefresh();
      } else {
        const data = await response.json();
        alert(data.error || "Purchase failed");
      }
    } catch (error) {
      console.error(error);
      alert("Purchase failed");
    }
    setLoading(false);
  };

  const handleSell = async () => {
    if (!unit._id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/biounits/${unit._id}/sell`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Sold for €${data.soldFor.toLocaleString('en-US')}`);
        await refreshSession();
        onRefresh();
      } else {
        const data = await response.json();
        alert(data.error || "Sale failed");
      }
    } catch (error) {
      console.error(error);
      alert("Sale failed");
    }
    setLoading(false);
  };

  const updateHealthStatus = async (healthStatus: BiounitAttributes["healthStatus"]) => {
    if (!unit._id) return;
    setLoading(true);
    await fetch(`/api/biounits/${unit._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ healthStatus }),
    });
    setLoading(false);
    onRefresh();
  };

  const healthBadge = {
    healthy: styles.healthy,
    moderate: styles.moderate,
    unhealthy: styles.unhealthy,
    deceased: styles.deceased,
  }[unit.healthStatus];

  return (
    <article className={styles.card}>
      <div className={styles.avatarSection}>
        <img src={imageUrl} alt={`Profile ${unit.bioId}`} className={styles.avatar} />
        <span className={clsx(styles.status, healthBadge)}>{unit.healthStatus}</span>
        {isOwned && <span className={styles.ownedBadge}>Owned</span>}
      </div>
      <header className={styles.header}>
        <div>
          <p className="pill">ID: {unit.bioId}</p>
          <h3>Age {unit.age} • {unit.bloodType}</h3>
        </div>
      </header>
      <section className={styles.metrics}>
        <div>
          <span>Athletic</span>
          <strong>{unit.athleticRating}</strong>
        </div>
        <div>
          <span>Organ Quality</span>
          <strong>{unit.organQualityScore}</strong>
        </div>
        <div>
          <span>Immune</span>
          <strong>{unit.immuneSystemStrength}</strong>
        </div>
        <div>
          <span>Value</span>
          <strong>€{finalPrice.toLocaleString('en-US')}</strong>
        </div>
      </section>
      <section className={styles.traits}>
        <span className={styles.traitsLabel}>Physical:</span>
        <div className={styles.organs}>
          <span className={styles.organPill}>{unit.heightCm}cm</span>
          <span className={styles.organPill}>{unit.weightKg}kg</span>
          <span className={styles.organPill}>{unit.mobilityStatus}</span>
        </div>
      </section>
      <p className={styles.log}>{unit.notes || unit.overallCondition}</p>
      
 
      {user && user.role !== "admin" && !isOwned && !unit.ownerId && (
        <div className={styles.actions}>
          <button 
            type="button" 
            disabled={loading || !canAfford} 
            onClick={handlePurchase}
            className={styles.purchaseBtn}
          >
            {loading ? "Processing..." : canAfford ? `Purchase for €${finalPrice.toLocaleString('en-US')}` : "Insufficient funds"}
          </button>
        </div>
      )}

      {isAdmin && !unit.ownerId && (
        <div className={styles.actions}>
          <button 
            type="button" 
            disabled={true}
            className={styles.disabledBtn}
          >
            Can't Purchase
          </button>
        </div>
      )}

      {user && user.role !== "admin" && isOwned && (
        <div className={styles.actions}>
          <button 
            type="button" 
            disabled={loading} 
            onClick={handleSell}
            className={styles.sellBtn}
          >
            {loading ? "Processing..." : `Sell for €${Math.floor(finalPrice * 0.8).toLocaleString('en-US')}`}
          </button>
        </div>
      )}


      {user?.role === "admin" && (
        <div className={styles.actions}>
          <button type="button" disabled={loading} onClick={() => updateHealthStatus("moderate")}>
            Mark Moderate
          </button>
          <button type="button" disabled={loading} onClick={() => updateHealthStatus("unhealthy")}>
            Mark Unhealthy
          </button>
          <button type="button" disabled={loading} onClick={() => updateHealthStatus("deceased")}>
            Mark Deceased
          </button>
        </div>
      )}
    </article>
  );
};
