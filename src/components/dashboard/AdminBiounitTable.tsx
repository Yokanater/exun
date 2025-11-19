"use client";

import { useCallback, useEffect, useState } from "react";
import type { BiounitAttributes } from "@/types/biounit";
import type { BiounitRecord } from "@/lib/biounits";
import styles from "./AdminBiounitTable.module.scss";

interface Props {
  initialItems: BiounitRecord[];
  refreshToken?: number;
}

const statuses: BiounitAttributes["status"][] = [
  "stable",
  "unstable",
  "observation",
  "biohazard",
  "contained",
];

export const AdminBiounitTable = ({ initialItems, refreshToken = 0 }: Props) => {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/biounits");
    const payload = await response.json();
    setItems(payload.biounits ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshToken]);

  const updateStatus = async (id: string, status: BiounitAttributes["status"]) => {
    setBusyId(id);
    await fetch(`/api/biounits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    refresh();
  };

  const removeUnit = async (id: string) => {
    setBusyId(id);
    await fetch(`/api/biounits/${id}`, { method: "DELETE" });
    setBusyId(null);
    refresh();
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Item ID</th>
          <th>Tier</th>
          <th>Value (€)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((unit) => (
          <tr key={unit._id}>
            <td>{unit.bioId}</td>
            <td>{unit.containmentTier.toUpperCase()}</td>
            <td>€{unit.priceMuCredits.toLocaleString()}</td>
            <td>
              <select
                value={unit.status}
                onChange={(event) => updateStatus(unit._id, event.target.value as (typeof statuses)[number])}
                disabled={busyId === unit._id}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={() => removeUnit(unit._id)} disabled={busyId === unit._id}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
