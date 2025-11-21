import { getSessionUser } from "@/lib/session";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import styles from "./marketplace.module.scss";

export default async function MarketplacePage() {
  const user = await getSessionUser();

  return (
    <div className={styles.marketplace}>
      <header className={styles.hero}>
        <div>
          <h1>Human Marketplace</h1>
          <p className={styles.description}>
            Premium specimens available for acquisition. All subjects undergo strict health screening 
            and are priced according to current market conditions and biological quality.
          </p>
        </div>
        {user && user.role !== "admin" && (
          <div className={styles.userInfo}>
            <span className={styles.label}>Available Balance</span>
            <strong className={styles.balance}>€{(user.balance || 0).toLocaleString('en-US')}</strong>
          </div>
        )}
      </header>
      <MarketplaceGrid />
    </div>
  );
}
