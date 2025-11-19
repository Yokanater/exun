export type UserRole = "operative" | "admin";

export interface SessionUser {
  id: string;
  username: string;
  role: UserRole;
  balance?: number;
}
