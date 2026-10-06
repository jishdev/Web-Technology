import React from "react";

export default function Admin() {
  return (
<>
  {/* Static Gradient Background */}
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>ADMIN</h1>
    <p className="schedule-subtitle">Organizer access only</p>
  </header>
  <main id="admin-page">
    <div className="admin-container">
      {/* Password Gate */}
      <div id="admin-gate" className="admin-gate">
        <div className="admin-gate-card">
          <div className="admin-gate-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x={4}
                y={10}
                width={16}
                height={10}
                rx={2}
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx={12} cy={15} r="1.4" fill="currentColor" />
            </svg>
          </div>
          <h2>Admin Access</h2>
          <p>Enter your credentials to manage HASH '27</p>
          <form
            id="admin-login-form"
            className="admin-login-form"
            onsubmit="event.preventDefault();"
          >
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                id="admin-username"
                placeholder="Username"
                autoComplete="off"
                required=""
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                id="admin-password"
                placeholder="Password"
                autoComplete="off"
                required=""
              />
            </div>
            <span id="admin-login-error" className="admin-login-error" />
            <button
              type="submit"
              id="admin-login-btn"
              className="register-submit-btn"
            >
              <span>Authenticate</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5L19 12L12 19"
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
      {/* Dashboard (shown after successful login) */}
      <div
        id="admin-dashboard"
        className="admin-dashboard"
        style={{ display: "none" }}
      >
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
          <button id="admin-logout-btn" className="clear-all-btn">
            Log Out
          </button>
        </div>
        <div className="register-form-card" id="admin-participants-mount" />
        <div id="admin-tasks-mount" />
        <div id="admin-log-mount" />
      </div>
    </div>
  </main>
</>
  );
}
