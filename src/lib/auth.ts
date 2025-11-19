import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SessionUser } from "@/types/user";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me";
const TOKEN_EXPIRY_SECONDS = 60 * 60 * 8; // 8 hours

export const TOKEN_COOKIE = "microsilk_token";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signSession = (user: SessionUser) =>
  jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_SECONDS });

export const verifySessionToken = (token?: string | null): SessionUser | null => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
};
