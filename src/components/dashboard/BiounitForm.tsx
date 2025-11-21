"use client";

import { FormEvent, useState } from "react";
import styles from "./BiounitForm.module.scss";

const defaultState = {
  bioId: "",
  age: 30,
  heightCm: 170,
  weightKg: 70,
  bloodType: "O+",
  healthStatus: "healthy",
  mobilityStatus: "mobile",
  overallCondition: "good",
  athleticRating: 50,
  organQualityScore: 50,
  immuneSystemStrength: 50,
  availableOrgans: "Liver, Kidneys, Corneas",
  basePrice: 500_000,
  priceModifier: 1.0,
  notes: "",
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
    
    let generatedImageUrl = null;
    try {
      const imageResponse = await fetch("/api/generate-human-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: form.age,
          heightCm: form.heightCm,
          weightKg: form.weightKg,
          athleticRating: form.athleticRating,
          organQualityScore: form.organQualityScore,
          immuneSystemStrength: form.immuneSystemStrength,
          notes: form.notes, // Include notes/lore for image generation
        }),
      });

      if (imageResponse.ok) {
        const imageResult = await imageResponse.json();
        generatedImageUrl = imageResult.imageUrl;
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
    
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
          generatedImageUrl, // Include the generated image
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
      <h3>Add New Subject</h3>
      <div className={styles.formGrid}>
        <label>
          Subject ID
          <input value={form.bioId} onChange={(event) => handleChange("bioId", event.target.value)} required />
        </label>
        <label>
          Age
          <input
            type="number"
            min={1}
            max={120}
            value={form.age}
            onChange={(event) => handleChange("age", Number(event.target.value))}
          />
        </label>
        <label>
          Height (cm)
          <input
            type="number"
            min={100}
            max={250}
            value={form.heightCm}
            onChange={(event) => handleChange("heightCm", Number(event.target.value))}
          />
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            min={30}
            max={300}
            value={form.weightKg}
            onChange={(event) => handleChange("weightKg", Number(event.target.value))}
          />
        </label>
        <label>
          Blood Type
          <select value={form.bloodType} onChange={(event) => handleChange("bloodType", event.target.value)}>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </label>
        <label>
          Health Status
          <select value={form.healthStatus} onChange={(event) => handleChange("healthStatus", event.target.value)}>
            <option value="healthy">Healthy</option>
            <option value="moderate">Moderate</option>
            <option value="unhealthy">Unhealthy</option>
            <option value="deceased">Deceased</option>
          </select>
        </label>
        <label>
          Mobility Status
          <select value={form.mobilityStatus} onChange={(event) => handleChange("mobilityStatus", event.target.value)}>
            <option value="mobile">Mobile</option>
            <option value="limited">Limited</option>
            <option value="non-mobile">Non-Mobile</option>
            <option value="sedated">Sedated</option>
          </select>
        </label>
        <label>
          Overall Condition
          <select value={form.overallCondition} onChange={(event) => handleChange("overallCondition", event.target.value)}>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="critical">Critical</option>
          </select>
        </label>
        <label>
          Athletic Rating (0-100)
          <input
            type="number"
            min={0}
            max={100}
            value={form.athleticRating}
            onChange={(event) => handleChange("athleticRating", Number(event.target.value))}
          />
        </label>
        <label>
          Organ Quality Score (0-100)
          <input
            type="number"
            min={0}
            max={100}
            value={form.organQualityScore}
            onChange={(event) => handleChange("organQualityScore", Number(event.target.value))}
          />
        </label>
        <label>
          Immune System Strength (0-100)
          <input
            type="number"
            min={0}
            max={100}
            value={form.immuneSystemStrength}
            onChange={(event) => handleChange("immuneSystemStrength", Number(event.target.value))}
          />
        </label>
        <label>
          Base Price (Exuncoin €)
          <input
            type="number"
            value={form.basePrice}
            onChange={(event) => handleChange("basePrice", Number(event.target.value))}
          />
        </label>
        <label>
          Price Modifier
          <input
            type="number"
            step={0.1}
            min={0.1}
            max={5}
            value={form.priceModifier}
            onChange={(event) => handleChange("priceModifier", Number(event.target.value))}
          />
        </label>
      </div>
      <label className={styles.fullWidth}>
        Available Organs (comma separated, e.g., "Heart, Liver, Kidneys")
        <input value={form.availableOrgans} onChange={(event) => handleChange("availableOrgans", event.target.value)} />
      </label>
      <label className={styles.fullWidth}>
        Notes
        <textarea value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} rows={3} />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? "Creating & Generating Image..." : "Create Subject"}
      </button>
    </form>
  );
};
