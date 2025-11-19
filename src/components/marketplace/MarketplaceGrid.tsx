"use client";

import { useCallback, useEffect, useState } from "react";
import type { BiounitAttributes, ContainmentTier } from "@/types/biounit";
import { BiounitCard } from "@/components/marketplace/BiounitCard";
import styles from "./MarketplaceGrid.module.scss";

const statusFilters: Array<{ value: BiounitAttributes["status"] | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "stable", label: "Stable" },
  { value: "unstable", label: "Unstable" },
  { value: "observation", label: "Observation" },
  { value: "biohazard", label: "Biohazard" },
  { value: "contained", label: "Contained" },
];

const containmentFilters: Array<{ value: ContainmentTier | "all"; label: string }> = [
  { value: "all", label: "Any Tier" },
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" },
  { value: "delta", label: "Delta" },
  { value: "omega", label: "Omega" },
];

export const MarketplaceGrid = () => {
  const [biounits, setBiounits] = useState<(BiounitAttributes & { _id: string })[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]["value"]>("all");
  const [tierFilter, setTierFilter] = useState<(typeof containmentFilters)[number]["value"]>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (tierFilter !== "all") params.set("tier", tierFilter);
    if (search) params.set("search", search);
    const response = await fetch(`/api/biounits?${params.toString()}`);
    const payload = await response.json();
    setBiounits(payload.biounits ?? []);
    setLoading(false);
  }, [search, statusFilter, tierFilter]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <input
          placeholder="Search Bio-ID"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onBlur={fetchUnits}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
          {statusFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select value={tierFilter} onChange={(event) => setTierFilter(event.target.value as typeof tierFilter)}>
          {containmentFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={fetchUnits} disabled={loading}>
          {loading ? "Loading" : "Crazy Feed"}
        </button>
      </div>
      {loading ? (
        <p className={styles.loading}>Finding yum humans…</p>
      ) : (
        <div className={styles.grid}>
          {biounits.map((unit) => (
            <BiounitCard key={unit._id} unit={unit} onRefresh={fetchUnits} />
          ))}
        </div>
      )}
    </div>
  );
};
