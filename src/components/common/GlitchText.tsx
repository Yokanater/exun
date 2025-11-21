"use client";

import type { ReactNode } from "react";
import styles from "./GlitchText.module.scss";

interface Props {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  accent?: boolean;
}

export const GlitchText = ({ children, size = "md", accent = false }: Props) => (
  <span className={`${styles.glitch} ${styles[size]} ${accent ? styles.accent : ""}`.trim()}>{children}</span>
);
