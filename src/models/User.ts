import { Schema, model, models, type Document } from "mongoose";
import type { UserRole } from "@/types/user";

export interface UserDocument extends Document {
  username: string;
  password: string;
  role: UserRole;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["operative", "admin"], default: "operative" },
    balance: { type: Number, default: 10000 },
  },
  { timestamps: true }
);

export const UserModel = models.User || model<UserDocument>("User", userSchema);
