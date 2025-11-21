import { WorthCalculator } from "@/components/calculator/WorthCalculator";
import { AIImageAnalyzer } from "@/components/calculator/AIImageAnalyzer";
import styles from "./calculator.module.scss";

export default function CalculatorPage() {
  return (
    <div className={styles.calculator}>
      <h1>Value Calculator</h1>
      
      <div className={styles.grid}>
        <WorthCalculator />
        <AIImageAnalyzer />
      </div>
    </div>
  );
}
