"use client";

import { FormEvent, useState } from "react";
import styles from "./BiounitForm.module.scss";

const defaultState = {
  bioId: "",
  shrinkPhase: 3,
  nanoVitalScore: 60,
  geneticStabilityIndex: 60,
  microHealthIndex: 60,
  containmentTier: "beta",
  threatEstimate: "moderate",
  availableOrgans: "Healthy, Athletic, Quick Learner",
  priceIndex: 1,
  priceMuCredits: 250_000,
  organDensityRating: 70,
  nanoVitalityBand: "volatile",
  cellStatus: "sealed",
  status: "stable",
  loreLog: "",
};

interface Props {
  onCreated: () => void;
}

export const BiounitForm = ({ onCreated }: Props) => {
  const [form, setForm] = useState(defaultState);
  const [busy, setBusy] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/biounits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          availableOrgans: form.availableOrgans
            .split(",")
            .map((organ) => organ.trim())
            .filter(Boolean),
        }),
      });
      if (!response.ok) {
        setBusy(false);
        return;
      }
      setBusy(false);
      setForm(defaultState);
      onCreated();
    } catch (error) {
      console.error(error);
      setBusy(false);
      return;
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Add New Item</h3>
      <div className={styles.formGrid}>
        <label>
          Item ID
          <input value={form.bioId} onChange={(event) => handleChange("bioId", event.target.value)} required />
        </label>
        <label>
          Price (Exuncoin €)
          <input
            type="number"
            value={form.priceMuCredits}
            onChange={(event) => handleChange("priceMuCredits", Number(event.target.value))}
          />
        </label>
        <label>
          Phase
          <input
            type="number"
            min={1}
            max={6}
            value={form.shrinkPhase}
            onChange={(event) => handleChange("shrinkPhase", Number(event.target.value))}
          />
        </label>
        <label>
          Vitality Score
          <input
            type="number"
            min={0}
            max={100}
            value={form.nanoVitalScore}
            onChange={(event) => handleChange("nanoVitalScore", Number(event.target.value))}
          />
        </label>
        <label>
          Stability Index
          <input
            type="number"
            min={0}
            max={100}
            value={form.geneticStabilityIndex}
            onChange={(event) => handleChange("geneticStabilityIndex", Number(event.target.value))}
          />
        </label>
        <label>
          Health Index
          <input
            type="number"
            min={0}
            max={100}
            value={form.microHealthIndex}
            onChange={(event) => handleChange("microHealthIndex", Number(event.target.value))}
          />
        </label>
        <label>
          Density Rating
          <input
            type="number"
            min={0}
            max={100}
            value={form.organDensityRating}
            onChange={(event) => handleChange("organDensityRating", Number(event.target.value))}
          />
        </label>
        <label>
          Tier
          <select value={form.containmentTier} onChange={(event) => handleChange("containmentTier", event.target.value)}>
            <option value="alpha">Alpha</option>
            <option value="beta">Beta</option>
            <option value="gamma">Gamma</option>
            <option value="delta">Delta</option>
            <option value="omega">Omega</option>
          </select>
        </label>
        <label>
          Priority Level
          <select value={form.threatEstimate} onChange={(event) => handleChange("threatEstimate", event.target.value)}>
            <option value="minor">Low</option>
            <option value="moderate">Medium</option>
            <option value="severe">High</option>
            <option value="cataclysmic">Critical</option>
          </select>
        </label>
        <label>
          Storage Status
          <select value={form.cellStatus} onChange={(event) => handleChange("cellStatus", event.target.value)}>
            <option value="sealed">Sealed</option>
            <option value="breached">Breached</option>
            <option value="frozen">Frozen</option>
          </select>
        </label>
        <label>
          Vitality Band
          <select value={form.nanoVitalityBand} onChange={(event) => handleChange("nanoVitalityBand", event.target.value)}>
            <option value="frail">Frail</option>
            <option value="volatile">Volatile</option>
            <option value="surging">Surging</option>
          </select>
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => handleChange("status", event.target.value)}>
            <option value="stable">Stable</option>
            <option value="unstable">Unstable</option>
            <option value="observation">Observation</option>
            <option value="biohazard">Biohazard</option>
            <option value="contained">Contained</option>
          </select>
        </label>
      </div>
      <label className={styles.fullWidth}>
        Traits (comma separated, e.g., "Healthy, Athletic, Public Speaker")
        <input value={form.availableOrgans} onChange={(event) => handleChange("availableOrgans", event.target.value)} />
      </label>
      <label className={styles.fullWidth}>
        Description
        <textarea value={form.loreLog} onChange={(event) => handleChange("loreLog", event.target.value)} rows={3} />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
};
