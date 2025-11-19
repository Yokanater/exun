"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import styles from "./AuthForm.module.scss";

interface Props {
  mode: "login" | "register";
}

export const AuthForm = ({ mode }: Props) => {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operative");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      if (!response.ok) {
        setError("Transmission rejected");
        setLoading(false);
        return;
      }
      const payload = await response.json();
      await refreshSession();
      const resolvedRole = payload?.user?.role ?? role;
      setLoading(false);
      router.replace(resolvedRole === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error(err);
      setError("Signal lost in catacomb tunnel");
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Decrypt Session" : "Splice Credentials"}</h2>
      <label>
        <span>Handle</span>
        <input value={username} onChange={(event) => setUsername(event.target.value)} required />
      </label>
      <label>
        <span>Passkey</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {mode === "register" && (
        <label>
          <span>Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="operative">Operative</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Wiring…" : mode === "login" ? "Enter Nexus" : "Forge Identity"}
      </button>
    </form>
  );
};
