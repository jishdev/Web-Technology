import React from "react";

export default function NotFound() {
  return (
    <main id="not-found">
      <header id="heroNonHome">
        <h1>404</h1>
        <p className="schedule-subtitle">Page not found</p>
      </header>
      <div className="register-container">
        <a className="cta-button" href="/">Back to Home</a>
      </div>
    </main>
  );
}
