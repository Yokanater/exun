"use client";

import { useState } from "react";
import type { BiounitRecord } from "@/lib/biounits";
import { AdminBiounitTable } from "@/components/dashboard/AdminBiounitTable";
import { AddHumanModal } from "@/components/dashboard/AddHumanModal";
import styles from "./AdminConsole.module.scss";

interface Props {
  initialItems: BiounitRecord[];
}

export const AdminConsole = ({ initialItems }: Props) => {
  const [refreshToken, setRefreshToken] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleCreated = () => {
    setRefreshToken((token) => token + 1);
  };

  return (
    <section className={styles.console}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Add a human</p>
          <h3>Intake Console</h3>
        </div>
        <button className={styles.launch} type="button" onClick={() => setModalOpen(true)}>
          Launch popup
        </button>
      </header>
      <AdminBiounitTable initialItems={initialItems} refreshToken={refreshToken} />
      <AddHumanModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </section>
  );
};
