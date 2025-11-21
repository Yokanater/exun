"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import styles from "./login.module.scss";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className={styles.authShell}>
      <div>
        <h1>Sign In</h1>
        <p>Access your account to continue.</p>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
