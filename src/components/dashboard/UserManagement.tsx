"use client";

import { useState, useEffect } from "react";
import styles from "./UserManagement.module.scss";

interface User {
  _id: string;
  username: string;
  role: string;
  balance: number;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "operative",
    balance: 10000,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setShowForm(false);
        setNewUser({ username: "", password: "", role: "operative", balance: 10000 });
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  const handleUpdateBalance = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: Number(editBalance) }),
      });

      if (response.ok) {
        setEditingUserId(null);
        setEditBalance("");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update balance");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update balance");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h3>User Management</h3>
        <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateUser} className={styles.form}>
          <h4>Create New User</h4>
          <div className={styles.formGrid}>
            <label>
              Username
              <input
                required
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </label>
            <label>
              Role
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="operative">Operative</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label>
              Initial Balance (€)
              <input
                type="number"
                required
                value={newUser.balance}
                onChange={(e) => setNewUser({ ...newUser, balance: Number(e.target.value) })}
              />
            </label>
          </div>
          <button type="submit">Create User</button>
        </form>
      )}

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div>Username</div>
          <div>Role</div>
          <div>Balance</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div key={user._id} className={styles.tableRow}>
            <div>{user.username}</div>
            <div>
              <span className={user.role === "admin" ? styles.adminBadge : styles.operativeBadge}>
                {user.role}
              </span>
            </div>
            <div>
              {editingUserId === user._id ? (
                <div className={styles.editBalance}>
                  <input
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    placeholder={String(user.balance)}
                  />
                  <button onClick={() => handleUpdateBalance(user._id)}>Save</button>
                  <button onClick={() => setEditingUserId(null)}>Cancel</button>
                </div>
              ) : (
                <span>€{user.balance?.toLocaleString()}</span>
              )}
            </div>
            <div className={styles.actions}>
              {editingUserId !== user._id && (
                <>
                  <button
                    onClick={() => {
                      setEditingUserId(user._id);
                      setEditBalance(String(user.balance));
                    }}
                  >
                    Edit Balance
                  </button>
                  <button onClick={() => handleDeleteUser(user._id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
