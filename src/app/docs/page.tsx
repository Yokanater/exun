import { Panel } from "@/components/common/Panel";
import styles from "./docs.module.scss";

const entries = [
  {
    title: "Getting Started",
    body: "Create an account to access the marketplace and calculator features. Browse listings, use our advanced valuation tools, and connect with other users in the community.",
  },
  {
    title: "Value Calculator",
    body: "Our calculator uses multiple factors including physical metrics, health indicators, and fitness levels to provide comprehensive valuations. All calculations use standardized algorithms.",
  },
  {
    title: "Marketplace Features",
    body: "Browse verified listings with detailed information. Filter by various criteria, view analytics, and track market trends through our dashboard interface.",
  },
];

export default function DocsPage() {
  return (
    <div className={styles.docs}>
      <h1>Documentation</h1>
      <p>Learn how to use the platform and make the most of our features.</p>
      <div className={styles.grid}>
        {entries.map((entry) => (
          <Panel key={entry.title}>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
