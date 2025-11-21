"use client";

import { useState, useRef } from "react";
import { calculateMuWorth } from "@/lib/calculator";
import { CreateHumanModal } from "./CreateHumanModal";
import styles from "./AIImageAnalyzer.module.scss";

export const AIImageAnalyzer = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setError(null);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: imagePreview }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const estimatedValue = analysis
    ? calculateMuWorth({
        height: analysis.heightCm,
        weight: analysis.weightKg,
        age: analysis.age,
        athleticRating: analysis.athleticRating,
        organQualityScore: analysis.organQualityScore,
        immuneSystemStrength: analysis.immuneSystemStrength,
      })
    : 0;

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <h3>AI Image Analyzer</h3>
        <p>Upload an image to estimate human market value using AI analysis</p>
      </div>

      <div className={styles.uploadArea}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        
        {!imagePreview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadBtn}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Click to upload image</span>
            <small>PNG, JPG up to 5MB</small>
          </button>
        ) : (
          <div className={styles.preview}>
            <img src={imagePreview} alt="Preview" />
            <button
              onClick={() => {
                setImagePreview(null);
                setAnalysis(null);
                setError(null);
              }}
              className={styles.removeBtn}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {imagePreview && !analysis && (
        <button
          onClick={analyzeImage}
          disabled={isAnalyzing}
          className={styles.analyzeBtn}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Image"}
        </button>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <div className={styles.results}>
          <div className={styles.attributes}>
            <div className={styles.attribute}>
              <span className={styles.label}>Age</span>
              <span className={styles.value}>{analysis.age} years</span>
            </div>
            <div className={styles.attribute}>
              <span className={styles.label}>Height</span>
              <span className={styles.value}>{analysis.heightCm} cm</span>
            </div>
            <div className={styles.attribute}>
              <span className={styles.label}>Weight</span>
              <span className={styles.value}>{analysis.weightKg} kg</span>
            </div>
            <div className={styles.attribute}>
              <span className={styles.label}>Athletic Rating</span>
              <span className={styles.value}>{analysis.athleticRating}/100</span>
            </div>
            <div className={styles.attribute}>
              <span className={styles.label}>Organ Quality</span>
              <span className={styles.value}>{analysis.organQualityScore}/100</span>
            </div>
            <div className={styles.attribute}>
              <span className={styles.label}>Immune System</span>
              <span className={styles.value}>{analysis.immuneSystemStrength}/100</span>
            </div>
          </div>

          <div className={styles.valueDisplay}>
            <p>Estimated Market Value</p>
            <h2>€{estimatedValue.toLocaleString('en-US')}</h2>
            <p className={styles.disclaimer}>
              *AI-generated estimate based on visual analysis
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className={styles.createBtn}
          >
            Create Human with These Attributes
          </button>
        </div>
      )}

      <CreateHumanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false);
          // Optionally refresh or show success message
        }}
        uploadedImageUrl={imagePreview || undefined}
        preloadedData={analysis ? {
          age: analysis.age,
          heightCm: analysis.heightCm,
          weightKg: analysis.weightKg,
          athleticRating: analysis.athleticRating,
          organQualityScore: analysis.organQualityScore,
          immuneSystemStrength: analysis.immuneSystemStrength,
        } : undefined}
      />
    </div>
  );
};
