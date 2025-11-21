"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, description, children }: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const previousOverflow = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow.current ?? "";
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} aria-hidden={!isOpen}>
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label="Close" />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-heading">
        <header className={styles.header}>
          <div>
            {title && (
              <h3 id="modal-heading" className={styles.title}>
                {title}
              </h3>
            )}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};
