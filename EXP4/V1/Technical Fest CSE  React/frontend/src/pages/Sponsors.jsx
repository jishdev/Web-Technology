import React from "react";
import { api, assetUrl } from "../api/client";
import { useApi } from "../hooks/useApi";
import Status from "../components/Status";
import SafeImage from "../components/SafeImage";

function Card({ tier, s }) {
  const body = (
    <>
      <div className="sponsor-logo">
        <SafeImage src={s.logoUrl} alt={s.name} />
      </div>
      <div className="sponsor-info">
        <h3>{s.name}</h3>
        {s.tagline && <p>{s.tagline}</p>}
      </div>
      <div className="sponsor-card-glow" />
      {tier === "title" && <div className="sponsor-border" />}
    </>
  );
  return s.websiteUrl ? (
    <a className={`sponsor-card ${tier}`} href={assetUrl(s.websiteUrl)} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div className={`sponsor-card ${tier}`}>{body}</div>
  );
}

export default function Sponsors() {
  const { data, error, loading, reload } = useApi((signal) => api.sponsors(signal), []);
  const tiers = data?.data ?? [];

  return (
    <>
      <header id="heroNonHome">
        <h1>OUR SPONSORS</h1>
        <p className="schedule-subtitle">Powered by industry leaders</p>
      </header>
      <main id="sponsors-page">
        <div className="sponsors-container">
          <Status loading={loading} error={error} onRetry={reload} what="sponsors" />
          {tiers.map((t) => (
            <div className="sponsor-tier" key={t.key}>
              <div className="tier-label">
                {t.key === "title" ? <span className="tier-icon">✦</span> : <span className="tier-line" />}
                <h2>{t.title}</h2>
                {t.key === "title" ? <span className="tier-icon">✦</span> : <span className="tier-line" />}
              </div>
              <div className={`sponsor-grid ${t.key}-tier`}>
                {t.sponsors.map((s) => (
                  <Card key={s.id} tier={t.key} s={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="sponsor-cta">
        <div className="sponsor-cta-card">
          <h2>Want to Sponsor HASH '27?</h2>
          <p>Join us in shaping the future of tech innovation</p>
          <a href="/contact" className="cta-button">
            Get in Touch
          </a>
        </div>
      </div>
    </>
  );
}
