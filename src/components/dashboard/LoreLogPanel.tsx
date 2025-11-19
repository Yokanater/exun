import type { LoreLogEntry } from "@/types/log";
import styles from "./LoreLogPanel.module.scss";

interface Props {
  logs: LoreLogEntry[];
}

export const LoreLogPanel = ({ logs }: Props) => (
  <div className={styles.panel}>
    {logs.map((log) => (
      <article key={`${log.source}-${log.message}`} className={styles.entry}>
        <header>
          <span>{log.source}</span>
          <span className={styles[log.severity]}>{log.severity}</span>
        </header>
        <p>{log.message}</p>
      </article>
    ))}
  </div>
);
