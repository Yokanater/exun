"use client";

import { useState } from "react";
import type { BiounitRecord } from "@/lib/biounits";
import { BiounitForm } from "@/components/dashboard/BiounitForm";
import { AdminBiounitTable } from "@/components/dashboard/AdminBiounitTable";
import styles from "./AdminConsole.module.scss";

interface Props {
  initialItems: BiounitRecord[];
}

export const AdminConsole = ({ initialItems }: Props) => {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className={styles.console}>
      <BiounitForm onCreated={() => setRefreshToken((token) => token + 1)} />
      <AdminBiounitTable initialItems={initialItems} refreshToken={refreshToken} />
    </div>
  );
};
