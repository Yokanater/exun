import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { buildAnalytics, fetchBiounits } from "@/lib/biounits";
import { fetchLoreLogs } from "@/lib/logs";
import { AnalyticsGrid } from "@/components/dashboard/AnalyticsGrid";
import { LoreLogPanel } from "@/components/dashboard/LoreLogPanel";
import { AdminConsole } from "@/components/dashboard/AdminConsole";
import { UserManagement } from "@/components/dashboard/UserManagement";
import styles from "./admin.module.scss";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const [analytics, logs, biounits] = await Promise.all([
    buildAnalytics(),
    fetchLoreLogs(),
    fetchBiounits(),
  ]);

  return (
    <div className={styles.admin}>
      <h1>Admin Dashboard</h1>
      <AnalyticsGrid data={analytics} />
      <AdminConsole initialItems={biounits} />
      <UserManagement />
      <LoreLogPanel logs={logs} />
    </div>
  );
}
