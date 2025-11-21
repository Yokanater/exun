"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import styles from "./register.module.scss";

export default function RegisterPage() {
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
        <h1>Create Account</h1>
        <p>Sign up to get started with the marketplace.</p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
