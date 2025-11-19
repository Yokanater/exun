import Link from "next/link";
import { GlitchText } from "@/components/common/GlitchText";
import { Panel } from "@/components/common/Panel";
import styles from "./page.module.scss";

const metrics = [
  {
    label: "Active Profiles",
    value: "847",
    description: "Unique individuals catalogued",
  },
  {
    label: "Humans Trafficked",
    value: "50000",
    description: "All shrunk up",
  },
  {
    label: "Trait Categories",
    value: "127",
    description: "Different traits for you",
  },
];

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <GlitchText size="lg">Humexun</GlitchText>
        <p>
          We traffic humans, and you should traffic them too
        </p>
        <div className={styles.actions}>
          <Link href="/marketplace" className="glass-button">
            View Profiles
          </Link>
          <Link href="/calculator" className="glass-button">
            Calculate Value
          </Link>
        </div>
      </div>
      <div className={styles.telemetry}>
        {metrics.map((item) => (
          <Panel key={item.label} accent="cyan">
            <span className={styles.metricLabel}>{item.label}</span>
            <strong className={styles.metricValue}>{item.value}</strong>
            <p>{item.description}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
