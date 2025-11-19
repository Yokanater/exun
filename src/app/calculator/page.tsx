import { WorthCalculator } from "@/components/calculator/WorthCalculator";
import styles from "./calculator.module.scss";

export default function CalculatorPage() {
  return (
    <div className={styles.calculator}>
      <h1>Value Calculator</h1>
   
      <WorthCalculator />
    </div>
  );
}
