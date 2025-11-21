"use client";

import { useState } from "react";
import { ORGAN_LABELS, type OrganAttributes } from "@/types/organ";
import styles from "./OrganCard.module.scss";

interface Props {
  organ: OrganAttributes;
  userId?: string | null;
  userBalance?: number;
  userRole?: string | null;
}

export const OrganCard = ({ organ, userId, userBalance = 0, userRole }: Props) => {
  const [busy, setBusy] = useState(false);

  const isOwned = organ.ownerId === userId;
  const isAdmin = userRole === "admin";
  const canAfford = userBalance >= organ.currentPrice;

  const handlePurchase = async () => {
    setBusy(true);
    await fetch(`/api/organs/${organ.organId}/purchase`, { method: "POST" });
    setBusy(false);
    window.location.reload();
  };

  const handleSell = async () => {
    setBusy(true);
    await fetch(`/api/organs/${organ.organId}/sell`, { method: "POST" });
    setBusy(false);
    window.location.reload();
  };

  const conditionColors = {
    pristine: styles.pristine,
    good: styles.good,
    acceptable: styles.acceptable,
    marginal: styles.marginal,
    damaged: styles.damaged,
  };

  const getOrganIcon = (type: string) => {
    const icons: Record<string, string> = {
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
    return icons[type] || "🔬";
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconBlock}>
          <span className={styles.icon}>{getOrganIcon(organ.organType)}</span>
        </div>
        <div>
          <h3>{ORGAN_LABELS[organ.organType]}</h3>
          <p className={styles.organId}>{organ.organId}</p>
        </div>
      </div>

      {isOwned && <div className={styles.ownedBadge}>Owned</div>}
      <div className={`${styles.condition} ${conditionColors[organ.condition]}`}>{organ.condition}</div>

      <div className={styles.details}>
        <div className={styles.row}>
          <span>Blood Type</span>
          <strong>{organ.bloodType}</strong>
        </div>
        <div className={styles.row}>
          <span>Quality Score</span>
          <strong>{organ.qualityScore}/100</strong>
        </div>
        {organ.tissueType && (
          <div className={styles.row}>
            <span>Tissue Type</span>
            <strong>{organ.tissueType}</strong>
          </div>
        )}
        <div className={styles.row}>
          <span>Source</span>
          <strong>{organ.sourceSubjectId}</strong>
        </div>
      </div>

      {organ.notes && <p className={styles.notes}>{organ.notes}</p>}

      <div className={styles.pricing}>
        <div>
          <span>Market Price</span>
          <strong className={styles.price}>€{organ.currentPrice.toLocaleString('en-US')}</strong>
        </div>
      </div>

      {userId && !isAdmin && (
        <div className={styles.actions}>
          {isOwned ? (
            <button onClick={handleSell} disabled={busy} className={styles.sellBtn}>
              {busy ? "Processing..." : "Sell Organ"}
            </button>
          ) : (
            <button onClick={handlePurchase} disabled={busy || !canAfford} className={styles.purchaseBtn}>
              {busy ? "Processing..." : canAfford ? "Purchase" : "Insufficient Funds"}
            </button>
          )}
        </div>
      )}

      {isAdmin && (
        <div className={styles.actions}>
          <button disabled={true} className={styles.disabledBtn}>
            Can't Purchase
          </button>
        </div>
      )}
    </div>
  );
};
