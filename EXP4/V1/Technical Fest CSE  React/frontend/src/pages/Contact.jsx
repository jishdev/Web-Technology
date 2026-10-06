import React, { useState } from "react";
import { api, ApiError } from "../api/client";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: "success" | "error", text }
  const [sending, setSending] = useState(false);

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setErrors({});
    setBanner(null);
    try {
      const res = await api.contact(form);
      setBanner({ type: "success", text: res.data.message });
      setForm(EMPTY);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors);
        setBanner({ type: "error", text: "Please fix the highlighted fields." });
      } else {
        setBanner({ type: "error", text: err.message });
      }
    } finally {
      setSending(false);
    }
  };

  const err = (name) => (errors[name] ? <span className="field-error" role="alert">{errors[name]}</span> : null);

  return (
<>
  {/* Static Gradient Background */}
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>GET IN TOUCH</h1>
    <p className="schedule-subtitle">We'd love to hear from you</p>
  </header>
  <main id="contact-page">
    <div className="contact-container">
      <div className="contact-layout">
        {/* Left Column - Contact Info */}
        <div className="contact-info-col">
          {/* Address Card */}
          <div className="contact-info-card">
            <div className="contact-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx={12}
                  cy={9}
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="contact-info-text">
              <h3>Visit Us</h3>
              <p>
                Department of Computer Science &amp; Engineering
                <br />
                Mar Baselios College of Engineering and Technology
                <br />
                Nalanchira, Thiruvananthapuram
                <br />
                Kerala - 695015
              </p>
            </div>
          </div>
          {/* Email Card */}
          <div className="contact-info-card">
            <div className="contact-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6L12 13L2 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="contact-info-text">
              <h3>Email Us</h3>
              <p>
                hash2027@mbcet.ac.in
                <br />
                cse@mbcet.ac.in
              </p>
            </div>
          </div>
          {/* Phone Card */}
          <div className="contact-info-card">
            <div className="contact-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3768 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5342 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.271 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.3038 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.0658 2.16708 8.43377 2.48353C8.80174 2.79999 9.04208 3.23945 9.11 3.72C9.23663 4.68007 9.47146 5.62273 9.81 6.53C9.94456 6.88792 9.97367 7.27691 9.89393 7.65088C9.81419 8.02485 9.62887 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5285 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5264 15.5763C21.8434 15.9493 22.0122 16.4242 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="contact-info-text">
              <h3>Call Us</h3>
              <p>
                +91 471 254 5866
                <br />
                +91 98765 43210
              </p>
            </div>
          </div>
          {/* Social Links */}
          <div className="contact-social">
            <h3>Follow HASH '26</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x={2}
                    y={2}
                    width={20}
                    height={20}
                    rx={5}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={12}
                    cy={12}
                    r={5}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="17.5" cy="6.5" r={1} fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x={2}
                    y={2}
                    width={20}
                    height={20}
                    rx={3}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 10V17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx={7} cy={7} r="1.5" fill="currentColor" />
                  <path
                    d="M11 17V13.5C11 12.6716 11.6716 12 12.5 12C13.3284 12 14 12.6716 14 13.5V17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11 13.5C11 12.6716 11.6716 12 12.5 12C13.3284 12 14 12.6716 14 13.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x={2}
                    y={4}
                    width={20}
                    height={16}
                    rx={4}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M10 9L15 12L10 15V9Z" fill="currentColor" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx={9} cy={10} r={1} fill="currentColor" />
                  <circle cx={15} cy={10} r={1} fill="currentColor" />
                  <path
                    d="M9.5 14C9.5 14 10.5 15.5 12 15.5C13.5 15.5 14.5 14 14.5 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 17.5C4 17.5 5 8 12 8C19 8 20 17.5 20 17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.5 17C7.5 17 8 13 12 13C16 13 16.5 17 16.5 17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* Right Column - Contact Form */}
        <div className="contact-form-col">
          <div className="contact-form-card">
            <h2>Send a Message</h2>
            <p>Drop us a line and we'll get back to you</p>
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name">Full Name</label>
                  <input id="c-name" type="text" placeholder="Your name" required minLength={2} maxLength={80} value={form.name} onChange={set("name")} />
                  {err("name")}
                </div>
                <div className="form-group">
                  <label htmlFor="c-email">Email Address</label>
                  <input id="c-email" type="email" placeholder="your@email.com" required value={form.email} onChange={set("email")} />
                  {err("email")}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-subject">Subject</label>
                <input id="c-subject" type="text" placeholder="What's this about?" required minLength={3} maxLength={150} value={form.subject} onChange={set("subject")} />
                {err("subject")}
              </div>
              <div className="form-group">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" placeholder="Write your message here..." rows={5} required minLength={10} maxLength={2000} value={form.message} onChange={set("message")} />
                {err("message")}
              </div>
              {banner && (
                <p className={`form-banner ${banner.type}`} role={banner.type === "error" ? "alert" : "status"}>
                  {banner.text}
                </p>
              )}
              <button type="submit" className="form-submit-btn" disabled={sending}>
                <span>{sending ? "Sending…" : "Send Message"}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
  {/* Map / Location Hint */}
  <div className="contact-map-hint">
    <div className="map-card">
      <div className="map-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <p>Visit us at the CSE Department, MBCET</p>
      <span>Monday – Friday | 9:00 AM – 4:00 PM</span>
    </div>
  </div>
</>
  );
}
