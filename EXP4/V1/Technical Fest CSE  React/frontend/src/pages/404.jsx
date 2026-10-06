import React from "react";

export default function 404() {
  return (
<>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        /* ==========================================================================\n           404 PAGE — CUSTOM STYLES\n           ========================================================================== */\n\n        .error-page {\n            min-height: 100vh;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            text-align: center;\n            padding: 40px 20px;\n            position: relative;\n            z-index: 1;\n        }\n\n        .error-container {\n            max-width: 600px;\n        }\n\n        .error-code {\n            font-family: 'Space Grotesk', sans-serif;\n            font-size: clamp(6rem, 15vw, 10rem);\n            font-weight: 700;\n            letter-spacing: -4px;\n            background: linear-gradient(135deg, #00c2ff, #ff3366, #00c2ff);\n            background-size: 200% 200%;\n            -webkit-background-clip: text;\n            background-clip: text;\n            -webkit-text-fill-color: transparent;\n            animation: gradient-shift 3s ease infinite;\n            margin-bottom: 10px;\n            line-height: 1;\n        }\n\n        @keyframes gradient-shift {\n            0%, 100% { background-position: 0% 50%; }\n            50% { background-position: 100% 50%; }\n        }\n\n        .error-emoji {\n            font-size: 4rem;\n            animation: float 3s ease-in-out infinite;\n            display: block;\n            margin-bottom: 15px;\n        }\n\n        @keyframes float {\n            0%, 100% { transform: translateY(0); }\n            50% { transform: translateY(-15px); }\n        }\n\n        .error-container h2 {\n            font-family: 'Space Grotesk', sans-serif;\n            font-size: clamp(1.4rem, 3vw, 1.8rem);\n            font-weight: 600;\n            color: #ffffff;\n            margin-bottom: 12px;\n            letter-spacing: 0.5px;\n        }\n\n        .error-container p {\n            font-family: 'Space Grotesk', sans-serif;\n            font-size: 1rem;\n            color: rgba(255, 255, 255, 0.5);\n            margin-bottom: 35px;\n            line-height: 1.6;\n        }\n\n        .error-buttons {\n            display: flex;\n            gap: 15px;\n            justify-content: center;\n            flex-wrap: wrap;\n        }\n\n        .error-btn {\n            font-family: 'Space Grotesk', sans-serif;\n            display: inline-block;\n            padding: 13px 28px;\n            font-size: 0.9rem;\n            font-weight: 600;\n            letter-spacing: 1.5px;\n            text-transform: uppercase;\n            text-decoration: none;\n            border-radius: 40px;\n            transition: all 0.3s ease;\n        }\n\n        .error-btn.primary {\n            color: #0a0a0f;\n            background: linear-gradient(135deg, #00c2ff, #007bff);\n            box-shadow: 0 6px 20px rgba(0, 194, 255, 0.3);\n        }\n\n        .error-btn.primary:hover {\n            transform: translateY(-3px);\n            box-shadow: 0 12px 30px rgba(0, 194, 255, 0.5);\n        }\n\n        .error-btn.secondary {\n            color: #ffffff;\n            background: rgba(255, 255, 255, 0.06);\n            border: 1px solid rgba(255, 255, 255, 0.15);\n        }\n\n        .error-btn.secondary:hover {\n            background: rgba(255, 255, 255, 0.12);\n            border-color: rgba(255, 255, 255, 0.3);\n            transform: translateY(-3px);\n        }\n\n        /* Floating decorative elements */\n        .error-decor {\n            position: fixed;\n            pointer-events: none;\n            z-index: 0;\n            opacity: 0.06;\n            font-size: 8rem;\n            animation: float-slow 8s ease-in-out infinite;\n        }\n\n        .error-decor:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; }\n        .error-decor:nth-child(2) { top: 60%; right: 5%; animation-delay: 2s; font-size: 5rem; }\n        .error-decor:nth-child(3) { bottom: 15%; left: 15%; animation-delay: 4s; font-size: 6rem; }\n        .error-decor:nth-child(4) { top: 30%; right: 15%; animation-delay: 6s; }\n\n        @keyframes float-slow {\n            0%, 100% { transform: translateY(0) rotate(0deg); }\n            50% { transform: translateY(-20px) rotate(5deg); }\n        }\n\n        /* Search box */\n        .error-search {\n            margin-top: 30px;\n            display: flex;\n            gap: 10px;\n            justify-content: center;\n        }\n\n        .error-search input {\n            font-family: 'Space Grotesk', sans-serif;\n            background: rgba(255, 255, 255, 0.04);\n            border: 1px solid rgba(255, 255, 255, 0.1);\n            padding: 12px 18px;\n            border-radius: 30px;\n            color: #ffffff;\n            font-size: 0.9rem;\n            outline: none;\n            width: 250px;\n            transition: all 0.3s ease;\n        }\n\n        .error-search input:focus {\n            border-color: rgba(0, 194, 255, 0.4);\n            box-shadow: 0 0 20px rgba(0, 194, 255, 0.1);\n        }\n\n        .error-search button {\n            font-family: 'Space Grotesk', sans-serif;\n            background: rgba(255, 255, 255, 0.06);\n            border: 1px solid rgba(255, 255, 255, 0.15);\n            color: #ffffff;\n            padding: 12px 20px;\n            border-radius: 30px;\n            cursor: pointer;\n            font-size: 0.85rem;\n            transition: all 0.3s ease;\n        }\n\n        .error-search button:hover {\n            background: rgba(0, 194, 255, 0.15);\n            border-color: rgba(0, 194, 255, 0.3);\n        }\n    "
    }}
  />
  {/* Static Background */}
  {/* Floating decorations */}
  <div className="error-decor">
    {"{"} {"}"}
  </div>
  <div className="error-decor">&lt;/&gt;</div>
  <div className="error-decor">#</div>
  <div className="error-decor">( )</div>
  {/* Error Content */}
  <main className="error-page">
    <div className="error-container">
      <span className="error-emoji">🔮</span>
      <h1 className="error-code">404</h1>
      <h2>You've drifted into uncharted code space</h2>
      <p>
        This page has been deleted, moved, or never existed in this dimension.
        <br />
        Maybe a semicolon was missing somewhere? 🤔
      </p>
      <div className="error-buttons">
        <a href="/" className="error-btn primary">
          🏠 Back to Home
        </a>
        <a href="/events" className="error-btn secondary">
          📅 View Events
        </a>
      </div>
      {/* Quick search */}
      <div className="error-search">
        <input type="text" id="errorSearch" placeholder="Search HASH '27..." />
        <button onclick="searchSite()">🔍 Search</button>
      </div>
    </div>
  </main>
</>
  );
}
