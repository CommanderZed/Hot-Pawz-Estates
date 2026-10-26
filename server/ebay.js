import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./env.js";

const TOKEN_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "data", "ebay-tokens.json");

const USER_SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.finances",
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly"
].join(" ");

function basicAuth() {
  return Buffer.from(`${config.clientId}:${config.certId}`).toString("base64");
}

function readTokens() {
  if (!existsSync(TOKEN_PATH)) return {};
  try {
    return JSON.parse(readFileSync(TOKEN_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeTokens(next) {
  mkdirSync(dirname(TOKEN_PATH), { recursive: true });
  writeFileSync(TOKEN_PATH, JSON.stringify(next, null, 2));
}

async function tokenRequest(body) {
  const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error_description || data.error || `Token request failed (${response.status})`);
    err.status = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

export function authorizeUrl(state) {
  const url = new URL("https://auth.ebay.com/oauth2/authorize");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", config.ruName);
  url.searchParams.set("scope", USER_SCOPES);
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCode(code) {
  const data = await tokenRequest(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.ruName
    }).toString()
  );
  const now = Date.now();
  writeTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    access_expires: now + (data.expires_in || 7200) * 1000,
    refresh_expires: now + (data.refresh_token_expires_in || 18 * 30 * 24 * 3600) * 1000
  });
}

export function isConnected() {
  const tokens = readTokens();
  return Boolean(tokens.refresh_token || (tokens.access_token && tokens.access_expires > Date.now()));
}

export function disconnect() {
  writeTokens({});
}

async function userToken() {
  const tokens = readTokens();
  if (tokens.access_token && tokens.access_expires > Date.now() + 60_000) return tokens.access_token;
  if (!tokens.refresh_token) throw new Error("eBay store is not connected.");
  const data = await tokenRequest(
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
      scope: USER_SCOPES
    }).toString()
  );
  writeTokens({
    ...tokens,
    access_token: data.access_token,
    access_expires: Date.now() + (data.expires_in || 7200) * 1000
  });
  return data.access_token;
}

async function ebayGet(path, { params, headers } = {}) {
  const url = new URL(`https://api.ebay.com${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null) url.searchParams.set(key, value);
    }
  }
  const token = await userToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "X-EBAY-C-MARKETPLACE-ID": config.marketplace,
      ...headers
    }
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    const message = data.errors?.[0]?.message || data.error_description || data.error || `eBay ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

function money(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (typeof value === "object" && value.value != null) return Number(value.value) || 0;
  return 0;
}

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

function lastDays(n) {
  const end = new Date();
  const start = new Date(Date.now() - n * 24 * 60 * 60 * 1000);
  return { start, end, startDay: isoDay(start), endDay: isoDay(end) };
}

async function settled(promise) {
  try {
    return { ok: true, data: await promise };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function getInsights() {
  const range = lastDays(30);
  const orderFilter = `creationdate:[${range.start.toISOString()}..${range.end.toISOString()}]`;
  const trafficFilter = `marketplace_ids:{${config.marketplace}},date_range:[${range.startDay}..${range.endDay}]`;

  const [user, standards, traffic, orders, offers, payouts] = await Promise.all([
    settled(ebayGet("/commerce/identity/v1/user/")),
    settled(ebayGet("/sell/analytics/v1/seller_standards_profile")),
    settled(
      ebayGet("/sell/analytics/v1/traffic_report", {
        params: {
          dimension: "DAY",
          metric: "LISTING_IMPRESSION_TOTAL,LISTING_VIEWS_TOTAL,CLICK_THROUGH_RATE,SALES_CONVERSION_RATE,TRANSACTION",
          filter: trafficFilter
        }
      })
    ),
    settled(ebayGet("/sell/fulfillment/v1/order", { params: { limit: "50", filter: orderFilter } })),
    settled(ebayGet("/sell/inventory/v1/offer", { params: { limit: "200" } })),
    settled(ebayGet("/sell/finances/v1/payout", { params: { limit: "20" } }))
  ]);

  const warnings = [user, standards, traffic, orders, offers, payouts]
    .filter((result) => !result.ok)
    .map((result) => result.error);

  const orderList = orders.data?.orders || [];
  const gmv = orderList.reduce((sum, order) => sum + money(order.pricingSummary?.total), 0);
  const itemTally = new Map();
  for (const order of orderList) {
    for (const item of order.lineItems || []) {
      const key = item.title || item.sku || item.lineItemId;
      const current = itemTally.get(key) || { title: item.title || key, quantity: 0, revenue: 0 };
      current.quantity += Number(item.quantity || 1);
      current.revenue += money(item.total?.value != null ? item.total : item.lineItemCost);
      itemTally.set(key, current);
    }
  }
  const topSold = [...itemTally.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  const offerList = (offers.data?.offers || []).filter((offer) => offer.status === "PUBLISHED" || offer.status === "ACTIVE" || !offer.status);
  const inventoryValue = offerList.reduce((sum, offer) => {
    const price = money(offer.pricingSummary?.price);
    const qty = Number(offer.availableQuantity ?? offer.listing?.quantity ?? 1);
    return sum + price * qty;
  }, 0);
  const categories = new Map();
  for (const offer of offerList) {
    const name = offer.categoryId || offer.listing?.categoryId || "Uncategorized";
    const current = categories.get(name) || { name, count: 0 };
    current.count += 1;
    categories.set(name, current);
  }

  const records = traffic.data?.records || [];
  const trafficRows = records.map((record) => {
    const day = record.dimensionValues?.[0]?.value || "";
    const metrics = Object.fromEntries((record.metricValues || []).map((metric) => [metric.metric, Number(metric.value) || 0]));
    return {
      date: day,
      impressions: metrics.LISTING_IMPRESSION_TOTAL || 0,
      views: metrics.LISTING_VIEWS_TOTAL || 0,
      ctr: metrics.CLICK_THROUGH_RATE || 0,
      conversion: metrics.SALES_CONVERSION_RATE || 0,
      transactions: metrics.TRANSACTION || 0
    };
  });
  const trafficTotals = trafficRows.reduce(
    (acc, row) => {
      acc.impressions += row.impressions;
      acc.views += row.views;
      acc.transactions += row.transactions;
      return acc;
    },
    { impressions: 0, views: 0, transactions: 0 }
  );

  const profile = (standards.data?.standardsProfiles || []).find((item) => item.cycle === "CURRENT") || standards.data?.standardsProfiles?.[0];

  return {
    connected: true,
    generatedAt: new Date().toISOString(),
    range: { start: range.startDay, end: range.endDay },
    user: {
      username: user.data?.username || user.data?.userId || "",
      accountType: user.data?.accountType || ""
    },
    sellerStandards: {
      program: profile?.program || "",
      level: profile?.standardsLevel || "",
      cycle: profile?.cycle || ""
    },
    kpis: {
      orders30d: orderList.length,
      gmv30d: Number(gmv.toFixed(2)),
      aov: orderList.length ? Number((gmv / orderList.length).toFixed(2)) : 0,
      activeListings: offerList.length,
      inventoryValue: Number(inventoryValue.toFixed(2)),
      impressions: trafficTotals.impressions,
      views: trafficTotals.views,
      transactions: trafficTotals.transactions,
      ctr: trafficTotals.impressions ? trafficTotals.views / trafficTotals.impressions : 0
    },
    traffic: trafficRows.slice(-14),
    topSold,
    recentOrders: orderList.slice(0, 12).map((order) => ({
      id: order.orderId,
      date: (order.creationDate || "").slice(0, 10),
      total: money(order.pricingSummary?.total),
      status: order.orderFulfillmentStatus || order.orderPaymentStatus || "",
      items: (order.lineItems || []).map((item) => item.title).filter(Boolean).slice(0, 2)
    })),
    listings: offerList.slice(0, 20).map((offer) => ({
      sku: offer.sku || "",
      title: offer.listing?.title || offer.sku || "Listing",
      price: money(offer.pricingSummary?.price),
      quantity: Number(offer.availableQuantity ?? 0),
      status: offer.status || ""
    })),
    categories: [...categories.values()].sort((a, b) => b.count - a.count).slice(0, 8),
    payouts: (payouts.data?.payouts || []).slice(0, 8).map((payout) => ({
      date: (payout.payoutDate || "").slice(0, 10),
      amount: money(payout.amount),
      status: payout.payoutStatus || "",
      id: payout.payoutId
    })),
    warnings
  };
}
