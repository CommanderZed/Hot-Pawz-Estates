import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

export const config = {
  clientId: process.env.EBAY_CLIENT_ID || "",
  certId: process.env.EBAY_CERT_ID || "",
  devId: process.env.EBAY_DEV_ID || "",
  ruName: process.env.EBAY_RU_NAME || "http://localhost:8765/api/ebay/callback",
  adminPassword: process.env.ADMIN_PASSWORD || "hotpawzestates",
  sessionSecret: process.env.SESSION_SECRET || "hot-pawz-admin-secret",
  apiPort: Number(process.env.API_PORT || 8766),
  marketplace: "EBAY_US"
};
