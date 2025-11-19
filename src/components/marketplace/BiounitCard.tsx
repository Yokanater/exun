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

  // crazy avatar for all users
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${unit.bioId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const isOwned = unit.ownerId === user?.id;
  const canAfford = user && (user.balance || 0) >= unit.priceMuCredits;

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
        alert(`Sold for €${data.soldFor.toLocaleString()}`);
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

  const mutateStatus = async (status: BiounitAttributes["status"]) => {
    if (!unit._id) return;
    setLoading(true);
    await fetch(`/api/biounits/${unit._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    onRefresh();
  };

  const containmentBadge = {
    stable: styles.stable,
    unstable: styles.unstable,
    observation: styles.observation,
    biohazard: styles.biohazard,
    contained: styles.contained,
  }[unit.status];

  return (
    <article className={styles.card}>
      <div className={styles.avatarSection}>
        <img src={avatarUrl} alt={`Profile ${unit.bioId}`} className={styles.avatar} />
        <span className={clsx(styles.status, containmentBadge)}>{unit.status}</span>
        {isOwned && <span className={styles.ownedBadge}>Owned</span>}
      </div>
      <header className={styles.header}>
        <div>
          <p className="pill">ID: {unit.bioId}</p>
          <h3>Subject #{unit.shrinkPhase}</h3>
        </div>
      </header>
      <section className={styles.metrics}>
        <div>
          <span>Stability</span>
          <strong>{unit.geneticStabilityIndex}%</strong>
        </div>
        <div>
          <span>Vitality</span>
          <strong>{unit.nanoVitalScore}</strong>
        </div>
        <div>
          <span>Density</span>
          <strong>{unit.organDensityRating}</strong>
        </div>
        <div>
          <span>Value</span>
          <strong>€{unit.priceMuCredits.toLocaleString()}</strong>
        </div>
      </section>
      <section className={styles.traits}>
        <span className={styles.traitsLabel}>Traits:</span>
        <div className={styles.organs}>
          {organs.map((organ) => (
            <span key={organ} className={styles.organPill}>
              {organ}
            </span>
          ))}
        </div>
      </section>
      <p className={styles.log}>{unit.loreLog}</p>
      
 
      {user && user.role !== "admin" && !isOwned && !unit.ownerId && (
        <div className={styles.actions}>
          <button 
            type="button" 
            disabled={loading || !canAfford} 
            onClick={handlePurchase}
            className={styles.purchaseBtn}
          >
            {loading ? "Processing..." : canAfford ? `Purchase for €${unit.priceMuCredits.toLocaleString()}` : "Insufficient funds"}
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
            {loading ? "Processing..." : `Sell for €${Math.floor(unit.priceMuCredits * 0.8).toLocaleString()}`}
          </button>
        </div>
      )}


      {user?.role === "admin" && (
        <div className={styles.actions}>
          <button type="button" disabled={loading} onClick={() => mutateStatus("unstable")}>
            Mark Unstable
          </button>
          <button type="button" disabled={loading} onClick={() => mutateStatus("observation")}>
            Observe
          </button>
          <button type="button" disabled={loading} onClick={() => mutateStatus("contained")}>
            Kill
          </button>
        </div>
      )}
    </article>
  );
};
