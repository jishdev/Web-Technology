import React, { useState } from "react";
import { useAccount } from "../context/AccountContext";
import { ApiError } from "../api/client";
import { formatDateTime } from "../api/format";
import { useApi } from "../hooks/useApi";
import { api } from "../api/client";
import Status from "../components/Status";

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_SIGNUP = { name: "", email: "", password: "", phone: "", institution: "" };

function FieldError({ message }) {
  return message ? <span className="field-error" role="alert">{message}</span> : null;
}

function AuthGate() {
  const { login, signup } = useAccount();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [signupForm, setSignupForm] = useState(EMPTY_SIGNUP);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setFormError("");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    try {
      const body = { ...signupForm };
      if (!body.phone.trim()) delete body.phone;
      if (!body.institution.trim()) delete body.institution;
      await signup(body);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id="admin-gate" className="admin-gate">
      <div className="admin-gate-card">
        <div className="admin-gate-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx={12} cy={8} r={3.5} stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p>{mode === "login" ? "Log in to track your HASH '27 registrations" : "Sign up to register faster and track your events"}</p>

        <div className="account-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === "login"} className={`admin-tab${mode === "login" ? " active" : ""}`} onClick={() => switchMode("login")}>
            Log In
          </button>
          <button type="button" role="tab" aria-selected={mode === "signup"} className={`admin-tab${mode === "signup" ? " active" : ""}`} onClick={() => switchMode("signup")}>
            Sign Up
          </button>
        </div>

        {mode === "login" ? (
          <form className="admin-login-form" onSubmit={onLogin}>
            <div className="form-group">
              <label htmlFor="acc-email">Email</label>
              <input id="acc-email" type="email" required autoComplete="email" value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} />
              <FieldError message={errors.email} />
            </div>
            <div className="form-group">
              <label htmlFor="acc-password">Password</label>
              <input id="acc-password" type="password" required autoComplete="current-password" value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} />
              <FieldError message={errors.password} />
            </div>
            {formError && <span className="admin-login-error" role="alert">{formError}</span>}
            <button type="submit" className="register-submit-btn" disabled={busy}>
              <span>{busy ? "Logging in…" : "Log In"}</span>
            </button>
          </form>
        ) : (
          <form className="admin-login-form" onSubmit={onSignup}>
            <div className="form-group">
              <label htmlFor="su-name">Full Name</label>
              <input id="su-name" type="text" required minLength={2} maxLength={80} value={signupForm.name} onChange={(e) => setSignupForm((f) => ({ ...f, name: e.target.value }))} />
              <FieldError message={errors.name} />
            </div>
            <div className="form-group">
              <label htmlFor="su-email">Email</label>
              <input id="su-email" type="email" required autoComplete="email" value={signupForm.email} onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))} />
              <FieldError message={errors.email} />
            </div>
            <div className="form-group">
              <label htmlFor="su-password">Password</label>
              <input id="su-password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={signupForm.password} onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))} />
              <FieldError message={errors.password} />
            </div>
            <div className="form-group">
              <label htmlFor="su-phone">Phone <span className="optional">(optional)</span></label>
              <input id="su-phone" type="tel" placeholder="10-digit number" value={signupForm.phone} onChange={(e) => setSignupForm((f) => ({ ...f, phone: e.target.value }))} />
              <FieldError message={errors.phone} />
            </div>
            <div className="form-group">
              <label htmlFor="su-inst">Institution <span className="optional">(optional)</span></label>
              <input id="su-inst" type="text" value={signupForm.institution} onChange={(e) => setSignupForm((f) => ({ ...f, institution: e.target.value }))} />
              <FieldError message={errors.institution} />
            </div>
            {formError && <span className="admin-login-error" role="alert">{formError}</span>}
            <button type="submit" className="register-submit-btn" disabled={busy}>
              <span>{busy ? "Creating account…" : "Sign Up"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function statusLabel(s) {
  return { confirmed: "Confirmed", attended: "Attended", cancelled: "Cancelled" }[s] || s;
}

function Profile() {
  const { user, logout, refresh } = useAccount();
  const regs = useApi((signal) => api.user.myRegistrations(signal), []);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", institution: user.institution || "" });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const body = { name: form.name };
      if (form.phone.trim()) body.phone = form.phone.trim();
      if (form.institution.trim()) body.institution = form.institution.trim();
      await api.user.updateMe(body);
      await refresh();
      setEditing(false);
      setMsg({ type: "success", text: "Profile updated." });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const rows = regs.data?.data ?? [];

  return (
    <div id="admin-dashboard" className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h2>My Account <small className="admin-user">({user.email})</small></h2>
        <button type="button" className="clear-all-btn" onClick={logout}>Log Out</button>
      </div>

      <div className="register-form-card admin-panel">
        <h3>Profile</h3>
        {!editing ? (
          <div className="admin-settings">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone || "—"}</p>
            <p><strong>Institution:</strong> {user.institution || "—"}</p>
            {msg && <p className={`form-banner ${msg.type}`}>{msg.text}</p>}
            <button type="button" className="admin-btn" onClick={() => setEditing(true)}>Edit profile</button>
          </div>
        ) : (
          <form className="admin-settings" onSubmit={save}>
            <div className="form-group">
              <label htmlFor="pf-name">Full Name</label>
              <input id="pf-name" type="text" required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="pf-phone">Phone</label>
              <input id="pf-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="pf-inst">Institution</label>
              <input id="pf-inst" type="text" value={form.institution} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} />
            </div>
            {msg?.type === "error" && <p className="form-banner error">{msg.text}</p>}
            <div className="admin-toolbar">
              <button type="submit" className="admin-btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
              <button type="button" className="admin-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="register-form-card admin-panel">
        <h3>My Registrations {regs.data?.meta && <small>({regs.data.meta.count})</small>}</h3>
        <Status loading={regs.loading} error={regs.error} onRetry={regs.reload} what="your registrations" />
        {!regs.loading && !regs.error && !rows.length && <p className="admin-empty">You haven't registered for any events yet.</p>}
        {rows.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Event</th><th>When</th><th>Registered</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><code>{r.code}</code></td>
                    <td>{r.event?.title}</td>
                    <td>Day {r.event?.day} · {r.event?.time} · {r.event?.venue}</td>
                    <td>{formatDateTime(r.createdAt)}</td>
                    <td><span className={`admin-pill ${r.status}`}>{statusLabel(r.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Account() {
  const { user, checking } = useAccount();
  return (
    <>
      <header id="heroNonHome">
        <h1>MY ACCOUNT</h1>
        <p className="schedule-subtitle">Manage your HASH '27 profile and registrations</p>
      </header>
      <main id="admin-page">
        <div className="admin-container">
          {checking ? <p className="status-msg" role="status">Checking session…</p> : user ? <Profile /> : <AuthGate />}
        </div>
      </main>
    </>
  );
}
