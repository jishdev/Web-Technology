import React from "react";

export default function Team() {
  return (
<>
  {/* Static Gradient Background */}
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>MEET THE TEAM</h1>
    <p className="schedule-subtitle">The minds behind HASH '27</p>
  </header>
  <main id="team-page">
    <div className="team-container">
      {/* Faculty Coordinator */}
      <div className="team-section">
        <h2 className="team-section-title">Faculty Coordinator</h2>
        <div className="team-grid patrons">
          <div className="team-card patron">
            <div className="team-card-photo">
              <img src="/assets/team-chandrika.jpg" alt="Ms. Chandrika Rajan" />
            </div>
            <div className="team-card-info">
              <h3>Ms. Chandrika Rajan</h3>
              <span className="team-role">Faculty Coordinator</span>
              <p className="team-dept">Computer Science &amp; Engineering</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
      {/* Student Coordinator */}
      <div className="team-section">
        <h2 className="team-section-title">Student Coordinator</h2>
        <div className="team-grid patrons">
          <div className="team-card patron">
            <div className="team-card-photo">
              <img src="/assets/team-jishnu.jpg" alt="E V Jishnu" />
            </div>
            <div className="team-card-info">
              <h3>E V Jishnu</h3>
              <span className="team-role">Student Coordinator</span>
              <p className="team-dept">Computer Science &amp; Engineering</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
      {/* Technical Team */}
      <div className="team-section">
        <h2 className="team-section-title">Technical Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-amaldev.jpg" alt="Amaldev S S" />
            </div>
            <div className="team-card-info">
              <h3>Amaldev S S</h3>
              <span className="team-role">Technical Lead</span>
              <p className="team-dept">Web &amp; Infrastructure</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-harigovind.jpg" alt="Harigovind S B" />
            </div>
            <div className="team-card-info">
              <h3>Harigovind S B</h3>
              <span className="team-role">Technical Co-Lead</span>
              <p className="team-dept">Backend &amp; Systems</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-henok.jpg" alt="Henok Anil Anton" />
            </div>
            <div className="team-card-info">
              <h3>Henok Anil Anton</h3>
              <span className="team-role">Technical Support</span>
              <p className="team-dept">Hardware &amp; Networking</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
      {/* Event Management */}
      <div className="team-section">
        <h2 className="team-section-title">Event Management</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-diya.jpg" alt="Diya Mathews" />
            </div>
            <div className="team-card-info">
              <h3>Diya Mathews</h3>
              <span className="team-role">Events Head</span>
              <p className="team-dept">Planning &amp; Operations</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-elza.png" alt="Elza Sabu" />
            </div>
            <div className="team-card-info">
              <h3>Elza Sabu</h3>
              <span className="team-role">Events Co-Head</span>
              <p className="team-dept">Scheduling &amp; Logistics</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-nandini.jpg" alt="Nandini P Nair" />
            </div>
            <div className="team-card-info">
              <h3>Nandini P Nair</h3>
              <span className="team-role">Event Coordinator</span>
              <p className="team-dept">Workshops &amp; Talks</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
      {/* Creative & Design */}
      <div className="team-section">
        <h2 className="team-section-title">Creative &amp; Design</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-anna-jose.jpg" alt="Anna Jose" />
            </div>
            <div className="team-card-info">
              <h3>Anna Jose</h3>
              <span className="team-role">Creative Lead</span>
              <p className="team-dept">UI/UX &amp; Visual Design</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-anna-george.jpg" alt="Anna George" />
            </div>
            <div className="team-card-info">
              <h3>Anna George</h3>
              <span className="team-role">Design Co-Lead</span>
              <p className="team-dept">Graphics &amp; Branding</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-aadarsh.jpg" alt="Aadarsh Narayan P S" />
            </div>
            <div className="team-card-info">
              <h3>Aadarsh Narayan P S</h3>
              <span className="team-role">Content Writer</span>
              <p className="team-dept">Copy &amp; Documentation</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
      {/* Outreach & PR */}
      <div className="team-section">
        <h2 className="team-section-title">Outreach &amp; Public Relations</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-sara.jpg" alt="Sara Robin Baby" />
            </div>
            <div className="team-card-info">
              <h3>Sara Robin Baby</h3>
              <span className="team-role">PR Lead</span>
              <p className="team-dept">Sponsorship &amp; Outreach</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-nayana.jpg" alt="Nayana Anna Binu" />
            </div>
            <div className="team-card-info">
              <h3>Nayana Anna Binu</h3>
              <span className="team-role">PR Co-Lead</span>
              <p className="team-dept">Social Media &amp; Comms</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-danil.jpg" alt="Danil R A" />
            </div>
            <div className="team-card-info">
              <h3>Danil R A</h3>
              <span className="team-role">Media Coordinator</span>
              <p className="team-dept">Photography &amp; Coverage</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
      {/* Operations & Support */}
      <div className="team-section">
        <h2 className="team-section-title">Operations &amp; Support</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-aakash.jpg" alt="Aakash Chandran" />
            </div>
            <div className="team-card-info">
              <h3>Aakash Chandran</h3>
              <span className="team-role">Operations Lead</span>
              <p className="team-dept">Venue &amp; Infrastructure</p>
            </div>
            <div className="team-card-glow" />
          </div>
          <div className="team-card">
            <div className="team-card-photo">
              <img src="/assets/team-adithya.jpg" alt="Adithya P" />
            </div>
            <div className="team-card-info">
              <h3>Adithya P</h3>
              <span className="team-role">Support Coordinator</span>
              <p className="team-dept">Volunteers &amp; Hospitality</p>
            </div>
            <div className="team-card-glow" />
          </div>
        </div>
      </div>
    </div>
  </main>
</>
  );
}
