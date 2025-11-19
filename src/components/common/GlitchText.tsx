"use client";

import type { ReactNode } from "react";
import styles from "./GlitchText.module.scss";

interface Props {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const GlitchText = ({ children, size = "md" }: Props) => (
  <span className={`${styles.glitch} ${styles[size]}`}>{children}</span>
);
