import { AuthForm } from "@/components/auth/AuthForm";
import styles from "./register.module.scss";

export default function RegisterPage() {
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
