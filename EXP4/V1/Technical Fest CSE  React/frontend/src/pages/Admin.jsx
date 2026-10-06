import React, { useEffect, useState } from "react";
import { api, tokenStore } from "../api/client";
import Dashboard from "./admin/Dashboard";

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(tokenStore.get()));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Resume an existing session
  useEffect(() => {
    if (!tokenStore.get()) return undefined;
    const c = new AbortController();
    api.admin
      .me(c.signal)
      .then((r) => setAdmin(r.data))
      .catch(() => {})
      .finally(() => setChecking(false));
    return () => c.abort();
  }, []);

  // Token rejected by the API (expired / revoked) -> back to the login gate
  useEffect(() => {
    const onUnauthorized = () => {
      setAdmin(null);
      setError("Session expired. Please log in again.");
    };
    window.addEventListener("hash27:unauthorized", onUnauthorized);
    return () => window.removeEventListener("hash27:unauthorized", onUnauthorized);
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api.admin.login(username, password);
      tokenStore.set(res.data.token);
      setAdmin(res.data.admin);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    tokenStore.clear();
    setAdmin(null);
    setError("");
  };

  return (
    <>
      <header id="heroNonHome">
        <h1>ADMIN</h1>
        <p className="schedule-subtitle">Organizer access only</p>
      </header>
      <main id="admin-page">
        <div className="admin-container">
          {checking ? (
            <p className="status-msg" role="status">Checking session…</p>
          ) : !admin ? (
            <div id="admin-gate" className="admin-gate">
              <div className="admin-gate-card">
                <div className="admin-gate-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x={4} y={10} width={16} height={10} rx={2} stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx={12} cy={15} r="1.4" fill="currentColor" />
                  </svg>
                </div>
                <h2>Admin Access</h2>
                <p>Enter your credentials to manage HASH '27</p>
                <form id="admin-login-form" className="admin-login-form" onSubmit={login}>
                  <div className="form-group">
                    <label htmlFor="admin-username">Username</label>
                    <input id="admin-username" type="text" placeholder="Username" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="admin-password">Password</label>
                    <input id="admin-password" type="password" placeholder="Password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <span id="admin-login-error" className="admin-login-error" role="alert">{error}</span>
                  <button type="submit" id="admin-login-btn" className="register-submit-btn" disabled={busy}>
                    <span>{busy ? "Authenticating…" : "Authenticate"}</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div id="admin-dashboard" className="admin-dashboard">
              <div className="admin-dashboard-header">
                <h2>Admin Dashboard <small className="admin-user">({admin.username})</small></h2>
                <button id="admin-logout-btn" type="button" className="clear-all-btn" onClick={logout}>
                  Log Out
                </button>
              </div>
              <Dashboard />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
