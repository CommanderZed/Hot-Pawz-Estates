import http from "node:http";
import crypto from "node:crypto";
import { config } from "./env.js";
import { clearSessionCookie, passwordsMatch, readSession, requireAdmin, setSessionCookie } from "./session.js";
import { authorizeUrl, disconnect, exchangeCode, getInsights, isConnected } from "./ebay.js";

const oauthStates = new Map();

function json(res, status, body, extraHeaders = {}) {
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  const cookie = res.getHeader("Set-Cookie");
  if (cookie && !headers["Set-Cookie"]) headers["Set-Cookie"] = cookie;
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${config.apiPort}`);

  try {
    if (req.method === "POST" && url.pathname === "/api/login") {
      const body = await readBody(req);
      if (!passwordsMatch(body.password)) return json(res, 401, { error: "That password is not correct." });
      setSessionCookie(res);
      return json(res, 200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/logout") {
      clearSessionCookie(res);
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && url.pathname === "/api/session") {
      const session = readSession(req);
      return json(res, 200, { signedIn: Boolean(session), ebayConnected: isConnected() });
    }

    if (req.method === "GET" && url.pathname === "/api/ebay/connect") {
      if (!requireAdmin(req, res)) return;
      const state = crypto.randomBytes(16).toString("hex");
      oauthStates.set(state, Date.now() + 10 * 60 * 1000);
      res.writeHead(302, { Location: authorizeUrl(state) });
      return res.end();
    }

    if (req.method === "GET" && url.pathname === "/api/ebay/callback") {
      const state = url.searchParams.get("state");
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error_description") || url.searchParams.get("error");
      const expiry = oauthStates.get(state);
      oauthStates.delete(state);
      if (error) {
        res.writeHead(302, { Location: `/admin?ebay=error&message=${encodeURIComponent(error)}` });
        return res.end();
      }
      if (!code || !expiry || expiry < Date.now()) {
        res.writeHead(302, { Location: "/admin?ebay=error&message=The%20eBay%20sign-in%20expired.%20Please%20try%20again." });
        return res.end();
      }
      try {
        await exchangeCode(code);
        res.writeHead(302, { Location: "/admin?ebay=connected" });
      } catch (err) {
        res.writeHead(302, { Location: `/admin?ebay=error&message=${encodeURIComponent(err.message)}` });
      }
      return res.end();
    }

    if (req.method === "POST" && url.pathname === "/api/ebay/disconnect") {
      if (!requireAdmin(req, res)) return;
      disconnect();
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && url.pathname === "/api/insights") {
      if (!requireAdmin(req, res)) return;
      if (!isConnected()) {
        return json(res, 200, {
          connected: false,
          message: "Connect the eBay store to load seller insights."
        });
      }
      const insights = await getInsights();
      return json(res, 200, insights);
    }

    json(res, 404, { error: "Not found" });
  } catch (error) {
    json(res, error.status && error.status < 500 ? error.status : 500, { error: error.message || "Server error" });
  }
});

server.listen(config.apiPort, "127.0.0.1", () => {
  console.log(`Hot Pawz admin API on http://127.0.0.1:${config.apiPort}`);
});
