import { useEffect, useMemo, useState } from "react";
import "./admin.css";

function money(value) {
  return Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function compact(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function pct(value) {
  return `${((Number(value) || 0) * 100).toFixed(1)}%`;
}

export default function Admin() {
  const [session, setSession] = useState({ loading: true, signedIn: false, ebayConnected: false });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [insights, setInsights] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);

  const notice = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ebay") === "connected") return { tone: "ok", text: "eBay store connected." };
    if (params.get("ebay") === "error") return { tone: "err", text: params.get("message") || "eBay could not connect." };
    return null;
  }, []);

  async function refreshSession() {
    const response = await fetch("/api/session");
    const data = await response.json();
    setSession({ loading: false, ...data });
    return data;
  }

  async function loadInsights() {
    setBusy(true);
    setLoadError("");
    try {
      const response = await fetch("/api/insights");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load insights.");
      setInsights(data);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    document.title = "Admin | Hot Pawz Estates";
    refreshSession().then((data) => {
      if (data.signedIn) loadInsights();
    });
  }, []);

  async function onLogin(event) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLoginError(data.error || "Unable to sign in.");
      return;
    }
    setPassword("");
    await refreshSession();
    await loadInsights();
  }

  async function onLogout() {
    await fetch("/api/logout", { method: "POST" });
    setInsights(null);
    setSession({ loading: false, signedIn: false, ebayConnected: false });
  }

  if (session.loading) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Loading…</p>
      </div>
    );
  }

  if (!session.signedIn) {
    return (
      <div className="admin-shell admin-login">
        <img src="/hot-pawz-logo.jpg" alt="" className="admin-logo" />
        <h1>Store admin</h1>
        <p className="admin-muted">Hot Pawz Estates eBay insights</p>
        <form onSubmit={onLogin}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button className="admin-btn" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const kpis = insights?.kpis || {};
  const maxViews = Math.max(1, ...(insights?.traffic || []).map((row) => row.views));

  return (
    <div className="admin-page">
      <header className="admin-top">
        <div>
          <p className="admin-kicker">Hot Pawz Estates</p>
          <h1>eBay insights</h1>
        </div>
        <div className="admin-actions">
          <button className="admin-btn ghost" type="button" onClick={loadInsights} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
          {insights?.connected ? (
            <form method="post" action="/api/ebay/disconnect" onSubmit={(event) => event.preventDefault()}>
              <button
                className="admin-btn ghost"
                type="button"
                onClick={async () => {
                  await fetch("/api/ebay/disconnect", { method: "POST" });
                  await refreshSession();
                  await loadInsights();
                }}
              >
                Disconnect
              </button>
            </form>
          ) : (
            <a className="admin-btn" href="/api/ebay/connect">
              Connect eBay
            </a>
          )}
          <button className="admin-btn ghost" type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      {notice && <p className={notice.tone === "ok" ? "admin-ok" : "admin-error"}>{notice.text}</p>}
      {loadError && <p className="admin-error">{loadError}</p>}

      {!insights?.connected && (
        <section className="admin-card connect">
          <h2>Connect the store</h2>
          <p>
            Sign in with the Hot Pawz eBay seller account to load the last 30 days of orders, traffic, listings, and
            payouts. After you approve access, eBay will send you back here.
          </p>
          <a className="admin-btn" href="/api/ebay/connect">
            Connect eBay store
          </a>
        </section>
      )}

      {insights?.connected && (
        <>
          <p className="admin-muted">
            {insights.user?.username ? `@${insights.user.username}` : "Connected seller"}
            {insights.sellerStandards?.level ? ` · ${insights.sellerStandards.level.replaceAll("_", " ")}` : ""}
            {insights.range ? ` · ${insights.range.start} to ${insights.range.end}` : ""}
          </p>

          <section className="kpi-grid">
            <article>
              <p>GMV, 30 days</p>
              <strong>{money(kpis.gmv30d)}</strong>
            </article>
            <article>
              <p>Orders</p>
              <strong>{compact(kpis.orders30d)}</strong>
            </article>
            <article>
              <p>Average order</p>
              <strong>{money(kpis.aov)}</strong>
            </article>
            <article>
              <p>Active listings</p>
              <strong>{compact(kpis.activeListings)}</strong>
            </article>
            <article>
              <p>Inventory value</p>
              <strong>{money(kpis.inventoryValue)}</strong>
            </article>
            <article>
              <p>Listing views</p>
              <strong>{compact(kpis.views)}</strong>
            </article>
            <article>
              <p>Impressions</p>
              <strong>{compact(kpis.impressions)}</strong>
            </article>
            <article>
              <p>View rate</p>
              <strong>{pct(kpis.ctr)}</strong>
            </article>
          </section>

          {insights.warnings?.length > 0 && (
            <p className="admin-warn">Some eBay reports were unavailable: {insights.warnings.join(" · ")}</p>
          )}

          <div className="admin-columns">
            <section className="admin-card">
              <h2>Traffic, last 14 days</h2>
              {(insights.traffic || []).length === 0 && <p className="admin-muted">No traffic data yet.</p>}
              <ul className="bars">
                {(insights.traffic || []).map((row) => (
                  <li key={row.date}>
                    <span>{row.date.slice(5)}</span>
                    <span className="bar" style={{ width: `${Math.max(6, (row.views / maxViews) * 100)}%` }} />
                    <em>{compact(row.views)}</em>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-card">
              <h2>Top sold items</h2>
              {(insights.topSold || []).length === 0 && <p className="admin-muted">No sold items in this window.</p>}
              <table>
                <tbody>
                  {(insights.topSold || []).map((item) => (
                    <tr key={item.title}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>{money(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <section className="admin-card">
            <h2>Recent orders</h2>
            {(insights.recentOrders || []).length === 0 && <p className="admin-muted">No orders in the last 30 days.</p>}
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(insights.recentOrders || []).map((order) => (
                  <tr key={order.id}>
                    <td>{order.date}</td>
                    <td>{order.items.join(", ") || order.id}</td>
                    <td>{order.status}</td>
                    <td>{money(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="admin-columns">
            <section className="admin-card">
              <h2>Active listings</h2>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(insights.listings || []).map((listing) => (
                    <tr key={listing.sku || listing.title}>
                      <td>{listing.title}</td>
                      <td>{listing.quantity}</td>
                      <td>{money(listing.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="admin-card">
              <h2>Payouts</h2>
              {(insights.payouts || []).length === 0 && <p className="admin-muted">No recent payouts.</p>}
              <table>
                <tbody>
                  {(insights.payouts || []).map((payout) => (
                    <tr key={payout.id}>
                      <td>{payout.date}</td>
                      <td>{payout.status}</td>
                      <td>{money(payout.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
