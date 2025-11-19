"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/providers/AuthContext";

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
