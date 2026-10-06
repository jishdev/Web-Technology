import React from "react";

export default function Sponsors() {
  return (
<>
  {/* Static Gradient Background */}
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>OUR SPONSORS</h1>
    <p className="schedule-subtitle">Powered by industry leaders</p>
  </header>
  <main id="sponsors-page">
    <div className="sponsors-container">
      {/* Title Sponsor */}
      <div className="sponsor-tier">
        <div className="tier-label">
          <span className="tier-icon">✦</span>
          <h2>Title Sponsor</h2>
          <span className="tier-icon">✦</span>
        </div>
        <div className="sponsor-grid title-tier">
          <div className="sponsor-card title">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-title.png" alt="Title Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>TechCorp International</h3>
              <p>Leading the future of innovation</p>
            </div>
            <div className="sponsor-card-glow" />
            <div className="sponsor-border" />
          </div>
        </div>
      </div>
      {/* Platinum Sponsors */}
      <div className="sponsor-tier">
        <div className="tier-label">
          <span className="tier-line" />
          <h2>Platinum Sponsors</h2>
          <span className="tier-line" />
        </div>
        <div className="sponsor-grid platinum-tier">
          <div className="sponsor-card platinum">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-platinum1.png" alt="Platinum Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>CloudSys Technologies</h3>
              <p>Cloud infrastructure partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card platinum">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-platinum2.png" alt="Platinum Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>DataForge Labs</h3>
              <p>AI &amp; analytics partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
        </div>
      </div>
      {/* Gold Sponsors */}
      <div className="sponsor-tier">
        <div className="tier-label">
          <span className="tier-line" />
          <h2>Gold Sponsors</h2>
          <span className="tier-line" />
        </div>
        <div className="sponsor-grid gold-tier">
          <div className="sponsor-card gold">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-gold1.png" alt="Gold Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>NeuralNet Systems</h3>
              <p>Machine learning solutions</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card gold">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-gold2.png" alt="Gold Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>CodeBase Ventures</h3>
              <p>Developer tools partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card gold">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-gold3.png" alt="Gold Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>QuantumEdge Inc.</h3>
              <p>Cybersecurity partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
        </div>
      </div>
      {/* Silver Sponsors */}
      <div className="sponsor-tier">
        <div className="tier-label">
          <span className="tier-line" />
          <h2>Silver Sponsors</h2>
          <span className="tier-line" />
        </div>
        <div className="sponsor-grid silver-tier">
          <div className="sponsor-card silver">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-silver1.png" alt="Silver Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>PixelForge Studio</h3>
              <p>Design &amp; creative partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card silver">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-silver2.png" alt="Silver Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>DevStream Media</h3>
              <p>Streaming &amp; content partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card silver">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-silver3.png" alt="Silver Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>InnoCafe</h3>
              <p>Food &amp; refreshments partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card silver">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-silver4.png" alt="Silver Sponsor" />
            </div>
            <div className="sponsor-info">
              <h3>PrintWave</h3>
              <p>Merchandise &amp; print partner</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
        </div>
      </div>
      {/* Community Partners */}
      <div className="sponsor-tier">
        <div className="tier-label">
          <span className="tier-line" />
          <h2>Community Partners</h2>
          <span className="tier-line" />
        </div>
        <div className="sponsor-grid community-tier">
          <div className="sponsor-card community">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-community1.png" alt="Community Partner" />
            </div>
            <div className="sponsor-info">
              <h3>TechMeetup Kerala</h3>
              <p>Community outreach</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card community">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-community2.png" alt="Community Partner" />
            </div>
            <div className="sponsor-info">
              <h3>StudentDev Hub</h3>
              <p>Student developer network</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
          <div className="sponsor-card community">
            <div className="sponsor-logo">
              <img src="/assets/sponsor-community3.png" alt="Community Partner" />
            </div>
            <div className="sponsor-info">
              <h3>Campus Connect</h3>
              <p>Inter-college network</p>
            </div>
            <div className="sponsor-card-glow" />
          </div>
        </div>
      </div>
    </div>
  </main>
  {/* Become a Sponsor CTA */}
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
