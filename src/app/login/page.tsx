import { AuthForm } from "@/components/auth/AuthForm";
import styles from "./login.module.scss";

export default function LoginPage() {
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
