import type { AnalyticsSummary } from "@/types/biounit";
import styles from "./AnalyticsGrid.module.scss";

interface Props {
  data: AnalyticsSummary;
}

export const AnalyticsGrid = ({ data }: Props) => (
  <div className={styles.grid}>
    <div>
      <span>Total Items</span>
      <strong>{data.totalBiounits}</strong>
    </div>
    <div>
      <span>Unstable</span>
      <strong>{data.unstableCount}</strong>
    </div>
    <div>
      <span>High Priority</span>
      <strong>{data.hazardousCount}</strong>
    </div>
    <div>
      <span>Avg Vitality</span>
      <strong>{data.averageNanoVitalScore}</strong>
    </div>
    <div>
      <span>Total Value</span>
      <strong>€{data.revenueProjection.toLocaleString()}</strong>
    </div>
    {Object.entries(data.containmentSpread).map(([tier, count]) => (
      <div key={tier}>
        <span>Tier {tier.toUpperCase()}</span>
        <strong>{count}</strong>
      </div>
    ))}
  </div>
);
