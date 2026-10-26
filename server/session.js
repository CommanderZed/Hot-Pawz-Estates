import crypto from "node:crypto";
import { config } from "./env.js";

const COOKIE = "hp_admin";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function sign(payload) {
  const body = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", config.sessionSecret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", config.sessionSecret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}

export function readSession(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  const data = verify(token);
  if (!data || data.exp < Date.now()) return null;
  return data;
}

export function requireAdmin(req, res) {
  const session = readSession(req);
  if (!session) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Please sign in." }));
    return null;
  }
  return session;
}

export function setSessionCookie(res) {
  const token = sign(JSON.stringify({ ok: true, exp: Date.now() + MAX_AGE_MS }));
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(MAX_AGE_MS / 1000)}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export function passwordsMatch(input) {
  const a = Buffer.from(String(input || ""));
  const b = Buffer.from(config.adminPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
