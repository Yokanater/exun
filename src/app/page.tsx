import Link from "next/link";

import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.logoContainer}>
          <svg 
            className={styles.logo}
            width="324" 
            height="123" 
            viewBox="0 0 324 123" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              className={styles.logoPath}
              d="M22.0744 55.7292C22.0744 55.7292 29.152 55.1218 35.8166 50.8705C42.4812 46.6192 48.4594 37.9928 48.4594 37.9928M48.4594 37.9928C69.3629 72.0191 109.234 117.677 172.689 117.677C233.364 117.677 270.697 75.9303 290.857 42.525L260.089 8.35743L320.005 75.771M48.4594 37.9928C36.044 17.7832 30.3197 1.6768 30.3197 1.6768" 
              stroke="#DAF261" 
              strokeWidth="10"
            />
            <path 
              className={styles.logoPath}
              d="M290.857 42.525C304.303 20.2458 310.11 1.6768 310.11 1.6768" 
              stroke="#DAF261" 
              strokeWidth="10"
            />
            <path 
              className={styles.logoPath}
              d="M49.2783 89.6583C39.8811 78.799 32.0713 67.6828 25.7544 57.4753C11.3487 34.1973 4.70686 15.6454 4.70686 15.6454" 
              stroke="#DAF261" 
              strokeWidth="10"
            />
          </svg>
        </div>
        <h1 className={styles.title}>
          <span className={styles.highlight}>H</span>um<span className={styles.highlight}>e</span>xun
        </h1>
        <p>
          We traffic humans, and you should traffic them too
        </p>
        <div className={styles.actions}>
          <Link href="/marketplace" className="glass-button">
            View Profiles
          </Link>
          <Link href="/calculator" className="glass-button">
            Calculate Value
          </Link>
        </div>
      </div>
    </section>
  );
}
