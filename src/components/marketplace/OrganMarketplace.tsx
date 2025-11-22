"use client";

import { useState, useMemo } from "react";
import { OrganCard } from "./OrganCard";
import styles from "./OrganMarketplace.module.scss";
import type { OrganAttributes } from "@/types/organ";

interface OrganMarketplaceProps {
  organs: OrganAttributes[];
  userId?: string;
  userBalance?: number;
  userRole?: string | null;
}

export const OrganMarketplace = ({ organs, userId, userBalance, userRole }: OrganMarketplaceProps) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterBloodType, setFilterBloodType] = useState<string>("all");
  const [filterCondition, setFilterCondition] = useState<string>("all");

  const filteredOrgans = useMemo(() => {
    return organs.filter((organ) => {
      if (filterType !== "all" && organ.organType !== filterType) return false;
      if (filterBloodType !== "all" && organ.bloodType !== filterBloodType) return false;
      if (filterCondition !== "all" && organ.condition !== filterCondition) return false;
      return true;
    });
  }, [organs, filterType, filterBloodType, filterCondition]);

  const stats = useMemo(() => {
    const available = filteredOrgans.length;
    const avgPrice = available > 0 
      ? Math.round(filteredOrgans.reduce((sum, o) => sum + o.currentPrice, 0) / available)
      : 0;
    const owned = filteredOrgans.filter(o => o.ownerId === userId).length;
    
    return { available, avgPrice, owned };
  }, [filteredOrgans, userId]);

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Filter by Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Organs</option>
            <option value="heart">Heart</option>
            <option value="liver">Liver</option>
            <option value="kidney">Kidney</option>
            <option value="lung">Lung</option>
            <option value="pancreas">Pancreas</option>
            <option value="cornea">Cornea</option>
            <option value="skin">Skin</option>
            <option value="bone_marrow">Bone Marrow</option>
            <option value="small_intestine">Small Intestine</option>
            <option value="blood">Blood</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Blood Type</label>
          <select value={filterBloodType} onChange={(e) => setFilterBloodType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="O-">O-</option>
            <option value="O+">O+</option>
            <option value="A-">A-</option>
            <option value="A+">A+</option>
            <option value="B-">B-</option>
            <option value="B+">B+</option>
            <option value="AB-">AB-</option>
            <option value="AB+">AB+</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Condition</label>
          <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
            <option value="all">All Conditions</option>
            <option value="pristine">Pristine</option>
            <option value="good">Good</option>
            <option value="acceptable">Acceptable</option>
            <option value="marginal">Marginal</option>
          </select>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span>Available</span>
          <strong>{stats.available}</strong>
        </div>
        <div className={styles.stat}>
          <span>Avg Price</span>
          <strong>€{stats.avgPrice.toLocaleString('en-US')}</strong>
        </div>
        <div className={styles.stat}>
          <span>Premium</span>
          <strong>{stats.owned}</strong>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredOrgans.length > 0 ? (
          filteredOrgans.map((organ) => (
            <OrganCard
              key={organ.organId}
              organ={organ}
              userId={userId}
              userBalance={userBalance}
              userRole={userRole}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <p>No organs match your filters</p>
          </div>
        )}
      </div>
    </>
  );
};
