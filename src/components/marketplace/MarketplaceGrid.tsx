"use client";

import { useCallback, useEffect, useState } from "react";
import type { BiounitAttributes } from "@/types/biounit";
import { BiounitCard } from "@/components/marketplace/BiounitCard";
import styles from "./MarketplaceGrid.module.scss";

const statusFilters: Array<{ value: string | "all"; label: string }> = [
  { value: "all", label: "All Health Status" },
  { value: "healthy", label: "Healthy" },
  { value: "moderate", label: "Moderate" },
  { value: "unhealthy", label: "Unhealthy" },
  { value: "deceased", label: "Deceased" },
];

const bloodTypeFilters: Array<{ value: string | "all"; label: string }> = [
  { value: "all", label: "All Blood Types" },
  { value: "O-", label: "O- (Universal)" },
  { value: "O+", label: "O+" },
  { value: "A-", label: "A-" },
  { value: "A+", label: "A+" },
  { value: "B-", label: "B-" },
  { value: "B+", label: "B+" },
  { value: "AB-", label: "AB-" },
  { value: "AB+", label: "AB+" },
];

export const MarketplaceGrid = () => {
  const [biounits, setBiounits] = useState<(BiounitAttributes & { _id: string })[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]["value"]>("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState<(typeof bloodTypeFilters)[number]["value"]>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("healthStatus", statusFilter);
    if (bloodTypeFilter !== "all") params.set("bloodType", bloodTypeFilter);
    if (search) params.set("search", search);
    const response = await fetch(`/api/biounits?${params.toString()}`);
    const payload = await response.json();
    setBiounits(payload.biounits ?? []);
    setLoading(false);
  }, [search, statusFilter, bloodTypeFilter]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <input
          placeholder="Search by Bio-ID..."
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
        <select value={bloodTypeFilter} onChange={(event) => setBloodTypeFilter(event.target.value as typeof bloodTypeFilter)}>
          {bloodTypeFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={fetchUnits} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      {loading ? (
        <p className={styles.loading}>Loading inventory...</p>
      ) : biounits.length === 0 ? (
        <p className={styles.loading}>No subjects available</p>
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
