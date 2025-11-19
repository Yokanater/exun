import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { fetchBiounits } from "@/lib/biounits";
import { Panel } from "@/components/common/Panel";
import styles from "./dashboard.module.scss";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const allUnits = await fetchBiounits();
  const ownedUnits = allUnits.filter((unit) => unit.ownerId === user.id);

  return (
    <div className={styles.dashboard}>
      <div className={styles.balanceCard}>
        <div>
          <span className={styles.balanceLabel}>Available Balance</span>
          <h2 className={styles.balanceAmount}>€{(user.balance || 0).toLocaleString()}</h2>
        </div>
        <div className={styles.stats}>
          <div>
            <span>Owned</span>
            <strong>{ownedUnits.length}</strong>
          </div>
          <div>
            <span>Total Value</span>
            <strong>
              €{ownedUnits.reduce((sum, unit) => sum + unit.priceMuCredits, 0).toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>My Collection</h3>
      {ownedUnits.length === 0 ? (
        <Panel>
          <p className={styles.emptyState}>
            You don't own any items yet. Visit the marketplace to get started.
          </p>
        </Panel>
      ) : (
        <div className={styles.ownedGrid}>
          {ownedUnits.map((unit) => {
            const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${unit.bioId}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
            return (
              <div key={unit.bioId} className={styles.ownedCard}>
                <img src={avatarUrl} alt={`Profile ${unit.bioId}`} className={styles.avatar} />
                <div className={styles.cardContent}>
                  <h4>Subject #{unit.shrinkPhase}</h4>
                  <p className={styles.bioId}>ID: {unit.bioId}</p>
                  <div className={styles.cardMetrics}>
                    <div>
                      <span>Value</span>
                      <strong>€{unit.priceMuCredits.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span>Stability</span>
                      <strong>{unit.geneticStabilityIndex}%</strong>
                    </div>
                    <div>
                      <span>Vitality</span>
                      <strong>{unit.nanoVitalScore}</strong>
                    </div>
                  </div>
                  <div className={styles.traits}>
                    {unit.availableOrgans.slice(0, 3).map((trait) => (
                      <span key={trait} className={styles.trait}>
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
