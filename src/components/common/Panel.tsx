import type { ReactNode } from "react";
import styles from "./Panel.module.scss";

interface PanelProps {
  title?: string;
  accent?: "cyan" | "magenta" | "amber";
  children: ReactNode;
}

export const Panel = ({ title, accent = "cyan", children }: PanelProps) => (
  <section className={`${styles.panel} ${styles[accent]}`}>
    {title && <header className={styles.header}>{title}</header>}
    <div>{children}</div>
  </section>
);
