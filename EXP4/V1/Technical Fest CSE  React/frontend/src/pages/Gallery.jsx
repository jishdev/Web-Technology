import React from "react";
import { api } from "../api/client";
import { dateRange } from "../api/format";
import { useApi } from "../hooks/useApi";
import Status from "../components/Status";
import SafeImage from "../components/SafeImage";

export default function Gallery() {
  const photos = useApi((signal) => api.gallery("2025", signal), []);
  const schedule = useApi((signal) => api.schedule(signal), []);
  const items = photos.data?.data ?? [];
  const dates = dateRange(schedule.data?.data?.days);
  return (
<>
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>GALLERY</h1>
    <p className="schedule-subtitle">Moments yet to be captured</p>
  </header>
  <main id="gallery-page">
    <div className="gallery-container">
      {/* Coming Soon Placeholder */}
      <div className="gallery-coming-soon">
        <div className="coming-soon-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x={2}
              y={3}
              width={20}
              height={18}
              rx={2}
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path
              d="M21 15L16 10L5 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Gallery Opens After HASH '27</h2>
        <p>
          Join us on <strong>{dates}</strong> to be part of these
          moments.
          <br />
          Photos from HASH '27 will be uploaded here after the event.
        </p>
        <a href="/register" className="cta-button">
          Register Now
        </a>
      </div>
      {/* Teaser Section: Previous Edition Highlights */}
      <div className="gallery-teaser-section">
        <h3 className="teaser-title">Glimpses from HASH '25</h3>
        <div className="gallery-teaser-deck">
          <Status loading={photos.loading} error={photos.error} onRetry={photos.reload} what="photos" />
          {items.map((g) => (
            <div className="teaser-card" key={g.id}>
              <div className="teaser-card-img">
                <SafeImage src={g.imageUrl} alt={g.alt || g.label} />
              </div>
              <div className="teaser-card-label">{g.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
</>
  );
}
