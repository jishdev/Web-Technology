import React from "react";

export default function Gallery() {
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
          Join us on <strong>February 14–16, 2027</strong> to be part of these
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
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img src="/assets/gallery-teaser1.png" alt="HASH 2025 Hackathon" />
            </div>
            <div className="teaser-card-label">Hackathon '25</div>
          </div>
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img src="/assets/gallery-teaser2.png" alt="HASH 2025 Workshop" />
            </div>
            <div className="teaser-card-label">Workshops '25</div>
          </div>
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img
                src="/assets/gallery-teaser3.png"
                alt="HASH 2025 Competition"
              />
            </div>
            <div className="teaser-card-label">Competitions '25</div>
          </div>
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img src="/assets/gallery-teaser4.png" alt="HASH 2025 Guest Talk" />
            </div>
            <div className="teaser-card-label">Guest Talks '25</div>
          </div>
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img src="/assets/gallery-teaser5.png" alt="HASH 2025 Team" />
            </div>
            <div className="teaser-card-label">The Crew '25</div>
          </div>
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img src="/assets/gallery-teaser6.png" alt="HASH 2025 Robotics" />
            </div>
            <div className="teaser-card-label">Robotics '25</div>
          </div>
          <div className="teaser-card">
            <div className="teaser-card-img">
              <img
                src="/assets/gallery-teaser7.png"
                alt="HASH 2025 Prize Night"
              />
            </div>
            <div className="teaser-card-label">Prize Night '25</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</>
  );
}
