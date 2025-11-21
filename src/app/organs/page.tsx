import { getSessionUser } from "@/lib/session";
import { connectDb } from "@/lib/db";
import { OrganModel } from "@/models/Organ";
import { OrganMarketplace } from "@/components/marketplace/OrganMarketplace";
import styles from "./organs.module.scss";

export default async function OrgansPage() {
  const user = await getSessionUser();
  
  await connectDb();
  const organDocs = await OrganModel.find({ isAvailable: true }).lean();
  const organs = organDocs.map(doc => {
    const plain = JSON.parse(JSON.stringify(doc));
    return {
      ...plain,
      _id: String(plain._id),
    };
  });

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <h1>Organ Marketplace</h1>
          <p className={styles.description}>
            Premium biological components harvested from verified subjects. All organs meet strict quality standards 
            and are priced according to current market conditions.
          </p>
        </div>
        {user && (
          <div className={styles.userInfo}>
            <span className={styles.label}>Available Balance</span>
            <strong className={styles.balance}>€{(user.balance || 0).toLocaleString('en-US')}</strong>
          </div>
        )}
      </header>

      <OrganMarketplace 
        organs={organs} 
        userId={user?.id}
        userBalance={user?.balance}
        userRole={user?.role}
      />
    </div>
  );
}
