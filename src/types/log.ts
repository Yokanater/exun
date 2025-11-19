export type LogSeverity = "info" | "anomaly" | "breach" | "cataclysm";

export interface LoreLogEntry {
  message: string;
  severity: LogSeverity;
  source: string;
  createdAt?: Date;
}
