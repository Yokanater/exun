"use client";

import { FormEvent, useState, useEffect } from "react";
import styles from "./CreateHumanModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  uploadedImageUrl?: string; // Add this to pass the uploaded image
  preloadedData?: {
    age: number;
    heightCm: number;
    weightKg: number;
    athleticRating: number;
    organQualityScore: number;
    immuneSystemStrength: number;
  };
}

export const CreateHumanModal = ({ isOpen, onClose, onCreated, preloadedData, uploadedImageUrl }: Props) => {
  const [form, setForm] = useState({
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
    basePrice: 50000,
    priceModifier: 1.0,
    notes: "",
  });
  
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (preloadedData) {
      setForm((prev) => ({
        ...prev,
        age: preloadedData.age,
        heightCm: preloadedData.heightCm,
        weightKg: preloadedData.weightKg,
        athleticRating: preloadedData.athleticRating,
        organQualityScore: preloadedData.organQualityScore,
        immuneSystemStrength: preloadedData.immuneSystemStrength,
        basePrice: Math.round(
          50000 * 
          (1 + preloadedData.athleticRating / 200) * 
          (0.7 + preloadedData.organQualityScore / 150)
        ),
      }));
    }
  }, [preloadedData, isOpen]);

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
      setForm({
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
        basePrice: 50000,
        priceModifier: 1.0,
        notes: "",
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2>Create New Subject</h2>

        {uploadedImageUrl && (
          <div className={styles.imagePreview}>
            <img src={uploadedImageUrl} alt="Uploaded Subject" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label>
              Subject ID
              <input
                value={form.bioId}
                onChange={(event) => handleChange("bioId", event.target.value)}
                required
              />
            </label>
            <label>
              Age
              <input
                type="number"
                min={18}
                max={65}
                value={form.age}
                onChange={(event) => handleChange("age", Number(event.target.value))}
              />
            </label>
            <label>
              Height (cm)
              <input
                type="number"
                min={150}
                max={200}
                value={form.heightCm}
                onChange={(event) => handleChange("heightCm", Number(event.target.value))}
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                min={45}
                max={120}
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
              <select
                value={form.mobilityStatus}
                onChange={(event) => handleChange("mobilityStatus", event.target.value)}
              >
                <option value="mobile">Mobile</option>
                <option value="limited">Limited</option>
                <option value="non-mobile">Non-Mobile</option>
                <option value="sedated">Sedated</option>
              </select>
            </label>
            <label>
              Overall Condition
              <select
                value={form.overallCondition}
                onChange={(event) => handleChange("overallCondition", event.target.value)}
              >
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
              Base Price (€)
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
            Available Organs (comma separated)
            <input
              value={form.availableOrgans}
              onChange={(event) => handleChange("availableOrgans", event.target.value)}
            />
          </label>
          <label className={styles.fullWidth}>
            Notes
            <textarea value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} rows={3} />
          </label>
          <button type="submit" disabled={busy}>
            {busy ? "Creating & Generating Image..." : "Create Subject"}
          </button>
        </form>
      </div>
    </div>
  );
};
