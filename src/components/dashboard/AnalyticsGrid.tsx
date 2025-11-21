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
      <span>Healthy</span>
      <strong>{data.healthyCount}</strong>
    </div>
    <div>
      <span>Critical</span>
      <strong>{data.criticalCount}</strong>
    </div>
    <div>
      <span>Avg Athletic</span>
      <strong>{data.averageAthleticRating}</strong>
    </div>
    <div>
      <span>Total Value</span>
      <strong>€{data.revenueProjection.toLocaleString('en-US')}</strong>
    </div>
    {Object.entries(data.conditionSpread).map(([condition, count]) => (
      <div key={condition}>
        <span>{condition}</span>
        <strong>{count}</strong>
      </div>
    ))}
  </div>
);
