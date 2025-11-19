"use client";

import { useMemo, useState } from "react";
import { calculateMuWorth, estimateDescriptions } from "@/lib/calculator";
import styles from "./WorthCalculator.module.scss";

export const WorthCalculator = () => {
  const [factors, setFactors] = useState({
    height: 175, 
    weight: 70,
    age: 30, 
    fitnessLevel: 65,
    healthScore: 75,
  });

  const worth = useMemo(() => calculateMuWorth(factors), [factors]);
  const description = useMemo(() => estimateDescriptions[Math.floor(Math.random() * estimateDescriptions.length)], [worth]);

  const updateFactor = (key: keyof typeof factors, value: number) => {
    setFactors((prev) => ({ ...prev, [key]: value }));
  };

  const factorConfig = {
    height: { min: 120, max: 220, label: "Height (cm)", unit: "cm" },
    weight: { min: 40, max: 150, label: "Weight (kg)", unit: "kg" },
    age: { min: 18, max: 80, label: "Age", unit: "years" },
    fitnessLevel: { min: 0, max: 100, label: "Fitness Level", unit: "%" },
    healthScore: { min: 0, max: 100, label: "Health Score", unit: "%" },
  };

  return (
    <div className={styles.shell}>
      <div className={styles.form}>        
        {Object.entries(factors).map(([key, value]) => {
          const config = factorConfig[key as keyof typeof factors];
          return (
            <label key={key}>
              <span>{config.label}</span>
              <input
                type="range"
                min={config.min}
                max={config.max}
                value={value}
                onChange={(event) => updateFactor(key as keyof typeof factors, Number(event.target.value))}
              />
              <em>{value} {config.unit}</em>
            </label>
          );
        })}
      </div>
      <div className={styles.output}>
        <p>Estimated Value</p>
        <h2>€{worth.toLocaleString()}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
