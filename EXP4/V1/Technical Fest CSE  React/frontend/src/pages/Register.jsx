import React, { useMemo, useState } from "react";
import { api, ApiError } from "../api/client";
import { dateRange, formatDateTime } from "../api/format";
import { useApi } from "../hooks/useApi";
import { useAccount } from "../context/AccountContext";

const EMPTY = { event: "", name: "", email: "", phone: "", year: "", department: "", institution: "", teamName: "" };

function FieldError({ message }) {
  return message ? <span className="field-error" role="alert">{message}</span> : null;
}

export default function Register() {
  const { user } = useAccount();
  const { data: sched, error: schedError } = useApi((signal) => api.schedule(signal), []);
  const days = useMemo(() => sched?.data?.days ?? [], [sched]);
  const regOpen = sched?.data?.registration?.open ?? true;
  const closesAt = sched?.data?.registration?.closesAt;

  const [form, setForm] = useState(() =>
    user ? { ...EMPTY, name: user.name, email: user.email, phone: user.phone || "", institution: user.institution || "" } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  };

  const selected = days.flatMap((d) => d.events).find((e) => e.slug === form.event);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});
    setFormError("");
    try {
      const body = { ...form };
      if (!body.teamName.trim()) delete body.teamName;
      const res = await api.register(body);
      setDone(res.data);
      setForm(user ? { ...EMPTY, name: user.name, email: user.email, phone: user.phone || "", institution: user.institution || "" } : EMPTY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
<>
  {/* Static Gradient Background */}
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>REGISTER</h1>
    <p className="schedule-subtitle">Secure your spot at HASH '27</p>
  </header>
  <main id="register-page">
    <div className="register-container">
      <div className="register-layout">
        {/* Left: Event Info */}
        <div className="register-info-col">
          <div className="register-info-card">
            <div className="register-info-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x={3}
                  y={4}
                  width={18}
                  height={18}
                  rx={2}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 2V6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8 2V6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
                <circle cx={8} cy={14} r={1} fill="currentColor" />
                <circle cx={12} cy={14} r={1} fill="currentColor" />
                <circle cx={16} cy={14} r={1} fill="currentColor" />
              </svg>
            </div>
            <h3>Event Dates</h3>
            <p>{dateRange(days)}</p>
          </div>
          <div className="register-info-card">
            <div className="register-info-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Venue</h3>
            <p>
              MBCET, Nalanchira
              <br />
              Thiruvananthapuram
            </p>
          </div>
          <div className="register-info-card">
            <div className="register-info-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3>Registration Closes</h3>
            <p>{closesAt ? formatDateTime(closesAt) : regOpen ? "Open until further notice" : "Closed"}</p>
          </div>
          <a href="/events" className="back-to-events">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Full Schedule
          </a>
        </div>
        {/* Right: Registration Form */}
        <div className="register-form-col">
          <div className="register-form-card">
            <h2>Event Registration</h2>
            <p>Fill in your details to register for HASH '27</p>
            {done ? (
              <div className="form-success" role="status">
                <h3>You're registered!</h3>
                <p>
                  <strong>{done.event.title}</strong>
                  <br />
                  Day {done.event.day} · {done.event.time} · {done.event.venue}
                </p>
                <p className="reg-code">{done.code}</p>
                <p>Keep this code — you'll need it at the venue.</p>
                <button type="button" className="register-submit-btn" onClick={() => setDone(null)}>
                  <span>Register for another event</span>
                </button>
                {user && (
                  <p className="admin-sub" style={{ marginTop: "12px" }}>
                    <a href="/account">View all your registrations</a>
                  </p>
                )}
              </div>
            ) : (
            <form className="register-form" onSubmit={onSubmit} noValidate={false}>
              {!regOpen && <p className="form-banner error">Registrations are currently closed.</p>}
              {!user && (
                <p className="admin-sub" style={{ marginBottom: "16px" }}>
                  <a href="/account">Log in or create an account</a> to save your details and track registrations.
                </p>
              )}
              {schedError && <p className="form-banner error">{schedError.message}</p>}
              <div className="form-group">
                <label htmlFor="reg-event">Select Event</label>
                <select id="reg-event" required value={form.event} onChange={set("event")}>
                  <option value="">Choose an event...</option>
                  {days.map((d) => (
                    <optgroup key={d.day} label={`Day ${d.day}${d.dateLabel ? ` — ${d.dateLabel}` : ""}`}>
                      {d.events.map((ev) => (
                        <option key={ev.id} value={ev.slug} disabled={ev.isFull || !ev.isActive}>
                          {ev.title}
                          {ev.isFull ? " (Full)" : !ev.isActive ? " (Closed)" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <FieldError message={errors.event} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <input id="reg-name" type="text" placeholder="Your full name" required minLength={2} maxLength={80} value={form.name} onChange={set("name")} />
                  <FieldError message={errors.name} />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" type="email" placeholder="your@email.com" required value={form.email} onChange={set("email")} />
                  <FieldError message={errors.email} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-phone">Phone Number</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="10-digit number"
                    pattern="^[6-9]\d{9}$"
                    title="Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9"
                    required
                    value={form.phone}
                    onChange={set("phone")}
                  />
                  <FieldError message={errors.phone} />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-year">Year of Study</label>
                  <select id="reg-year" required value={form.year} onChange={set("year")}>
                    <option value="">Select year...</option>
                    <option value="S1">S1 — First Year</option>
                    <option value="S3">S3 — Second Year</option>
                    <option value="S5">S5 — Third Year</option>
                    <option value="S7">S7 — Final Year</option>
                    <option value="PG">Postgraduate</option>
                  </select>
                  <FieldError message={errors.year} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-dept">Department</label>
                  <input id="reg-dept" type="text" placeholder="e.g. CSE, ECE, ME" required maxLength={60} value={form.department} onChange={set("department")} />
                  <FieldError message={errors.department} />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-inst">Institution</label>
                  <input id="reg-inst" type="text" placeholder="College name" required minLength={2} maxLength={120} value={form.institution} onChange={set("institution")} />
                  <FieldError message={errors.institution} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reg-team">
                  Team Name <span className="optional">{selected && !selected.isTeamEvent ? "(team events only)" : "(Hackathon only)"}</span>
                </label>
                <input id="reg-team" type="text" placeholder="If registering as a team" maxLength={60} value={form.teamName} onChange={set("teamName")} />
                <FieldError message={errors.teamName} />
              </div>
              {formError && <p className="form-banner error" role="alert">{formError}</p>}
              <button type="submit" className="register-submit-btn" disabled={submitting || !regOpen}>
                <span>{submitting ? "Registering…" : "Complete Registration"}</span>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  </main>
</>
  );
}
