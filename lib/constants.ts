import { AllowedOrigin } from "./types";

export const ORIGIN_MAP: Record<string, AllowedOrigin> = {
  production: "https://wallet.coinwala.io",
} as const;

export const ALLOWED_ORIGINS: AllowedOrigin[] = [
  ...Object.values(ORIGIN_MAP),
  "http://localhost:3001",
  "http://localhost:3000",
  "https://wallet.coinwala.io",
];
