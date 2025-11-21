"use client";

import { Modal } from "@/components/common/Modal";
import { BiounitForm } from "@/components/dashboard/BiounitForm";
import styles from "./AddHumanModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const checklist = [
  "Verify the subject's latest containment tier",
  "Confirm valuation in Exun credits",
  "List at least three compelling traits",
  "Attach a short description for lore logs",
];

export const AddHumanModal = ({ isOpen, onClose, onCreated }: Props) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Add a Human Asset"
    description="Streamlined intake for new human micro-units. Keep values precise, labels uppercase, and narratives clipped."
  >
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.caption}>Pre-flight Checklist</p>
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={styles.caption}>Optimized for speed — all inputs validate instantly.</p>
      </aside>
      <div className={styles.formArea}>
        <BiounitForm
          onCreated={() => {
            onCreated();
            onClose();
          }}
        />
      </div>
    </div>
  </Modal>
);
