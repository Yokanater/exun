import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { fetchBiounits } from "@/lib/biounits";
import { AdminConsole } from "@/components/dashboard/AdminConsole";
import { UserManagement } from "@/components/dashboard/UserManagement";
import styles from "./admin.module.scss";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const biounits = await fetchBiounits();

  return (
    <div className={styles.admin}>
      <h1>Admin Dashboard</h1>
      <AdminConsole initialItems={biounits} />
      <UserManagement />
    </div>
  );
}
