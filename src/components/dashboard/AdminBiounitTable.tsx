"use client";

import { useCallback, useEffect, useState } from "react";
import type { HealthStatus } from "@/types/biounit";
import type { BiounitRecord } from "@/lib/biounits";
import { OrganHarvestModal } from "@/components/dashboard/OrganHarvestModal";
import styles from "./AdminBiounitTable.module.scss";

interface Props {
  initialItems: BiounitRecord[];
  refreshToken?: number;
}

export const AdminBiounitTable = ({ initialItems, refreshToken = 0 }: Props) => {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<BiounitRecord | null>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/biounits");
    const payload = await response.json();
    setItems(payload.biounits ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshToken]);

  const updateHealthStatus = async (id: string, healthStatus: HealthStatus) => {
    setBusyId(id);
    await fetch(`/api/biounits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ healthStatus }),
    });
    setBusyId(null);
    refresh();
  };

  const killSubject = (unit: BiounitRecord) => {
    setSelectedSubject(unit);
    setHarvestModalOpen(true);
  };

  const handleHarvestComplete = () => {
    setHarvestModalOpen(false);
    setSelectedSubject(null);
    refresh();
  };

  const removeUnit = async (id: string) => {
    setBusyId(id);
    await fetch(`/api/biounits/${id}`, { method: "DELETE" });
    setBusyId(null);
    refresh();
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Subject ID</th>
            <th>Age</th>
            <th>Health</th>
            <th>Value (€)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((unit) => {
            const finalPrice = Math.round(unit.basePrice * unit.priceModifier);
            const isDeceased = unit.healthStatus === "deceased";
            
            return (
              <tr key={unit._id}>
                <td>{unit.bioId}</td>
                <td>{unit.age} yrs</td>
                <td>
                  <select
                    value={unit.healthStatus}
                    onChange={(event) => updateHealthStatus(unit._id, event.target.value as HealthStatus)}
                    disabled={busyId === unit._id || isDeceased}
                    className={styles[unit.healthStatus]}
                  >
                    <option value="healthy">Healthy</option>
                    <option value="moderate">Moderate</option>
                    <option value="unhealthy">Unhealthy</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </td>
                <td>€{finalPrice.toLocaleString('en-US')}</td>
                <td className={styles.actionCell}>
                  {!isDeceased && (
                    <button
                      onClick={() => killSubject(unit)}
                      disabled={busyId === unit._id}
                      className={styles.killBtn}
                    >
                      Kill & Harvest
                    </button>
                  )}
                  <button onClick={() => removeUnit(unit._id)} disabled={busyId === unit._id}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedSubject && (
        <OrganHarvestModal
          isOpen={harvestModalOpen}
          onClose={() => {
            setHarvestModalOpen(false);
            setSelectedSubject(null);
          }}
          subject={selectedSubject}
          onHarvestComplete={handleHarvestComplete}
        />
      )}
    </>
  );
};
