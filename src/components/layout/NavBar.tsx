"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useAuth } from "@/providers/AuthContext";
import styles from "./NavBar.module.scss";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/calculator", label: "Calculator" },
];

export const NavBar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className={styles.shell}>
      <Link href="/" className={styles.logo}>
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
                <span className={styles.balance}>€{user.balance.toLocaleString()}</span>
              )}
            </div>
            <button type="button" className={styles.sessionBtn}>
            <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
              Dashboard
            </Link>
            </button>
            <button type="button" onClick={logout} className={styles.sessionBtn}>
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
