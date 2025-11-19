import { GlitchText } from "@/components/common/GlitchText";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import styles from "./marketplace.module.scss";

export default function MarketplacePage() {
  return (
    <div className={styles.marketplace}>
      <div className={styles.header}>
        <GlitchText size="md">Browse Our Top Quality Humans, shrinked just for you</GlitchText>
      </div>
      <MarketplaceGrid />
    </div>
  );
}
