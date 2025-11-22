"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { useAuth } from "@/providers/AuthContext";
import styles from "./NavBar.module.scss";

const navItems = [

  { href: "/marketplace", label: "Marketplace" },
  { href: "/organs", label: "Organs" },
  { href: "/calculator", label: "Calculator" },
];

export const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className={styles.shell}>
      <Link href="/" className={styles.logo}>
        <svg 
          width="40" 
          height="20" 
          viewBox="0 0 324 123" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M22.0744 55.7292C22.0744 55.7292 29.152 55.1218 35.8166 50.8705C42.4812 46.6192 48.4594 37.9928 48.4594 37.9928M48.4594 37.9928C69.3629 72.0191 109.234 117.677 172.689 117.677C233.364 117.677 270.697 75.9303 290.857 42.525L260.089 8.35743L320.005 75.771M48.4594 37.9928C36.044 17.7832 30.3197 1.6768 30.3197 1.6768" 
            stroke="#DAF261" 
            strokeWidth="10"
          />
          <path 
            d="M290.857 42.525C304.303 20.2458 310.11 1.6768 310.11 1.6768" 
            stroke="#DAF261" 
            strokeWidth="10"
          />
          <path 
            d="M49.2783 89.6583C39.8811 78.799 32.0713 67.6828 25.7544 57.4753C11.3487 34.1973 4.70686 15.6454 4.70686 15.6454" 
            stroke="#DAF261" 
            strokeWidth="10"
          />
        </svg>
        <span>Humexun</span>
      </Link>
      <nav className={styles.navLinks}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={classNames(styles.link, pathname === item.href && styles.active)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.session}>
        {user ? (
          <>
            <div className={styles.sessionMeta}>
              <span className={styles.userName}>{user.username}</span>
              <span className={styles.userRole}>{user.role}</span>
              {user.role !== "admin" && user.balance !== undefined && (
                <span className={styles.balance}>€{user.balance.toLocaleString('en-US')}</span>
              )}
            </div>
            <button type="button" className={styles.sessionBtn}>
            <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
              Dashboard
            </Link>
            </button>
            <button type="button" onClick={handleLogout} className={styles.sessionBtn}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.sessionBtn}>
              Login
            </Link>
            <Link href="/register" className={styles.sessionBtnSecondary}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
