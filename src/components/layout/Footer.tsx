import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <p>© {new Date().getFullYear()} Modern Marketplace.</p>
        <p>All rights reserved.</p>
      </div>
      <div className={styles.grid}>
        <span>System Status: Operational</span>
        <span>Active Users: 1,234</span>
        <span>Server: Online</span>
      </div>
    </footer>
  );
};
