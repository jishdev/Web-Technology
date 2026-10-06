import React from "react";

export default function Events() {
  return (
<>
  <div className="events-bg" />
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>EVENT SCHEDULE</h1>
    <p className="schedule-subtitle">
      Three days of innovation, code, and tech excellence
    </p>
  </header>
  <main id="events-page">
    <div className="schedule-container">
      {/* Day 1 */}
      <div className="day-section">
        <div className="day-header">
          <span className="day-number">01</span>
          <div className="day-info">
            <h2>Wednesday</h2>
            <p>October 14, 2027</p>
          </div>
          <div className="day-line" />
        </div>
        <div className="event-cards">
          <div className="event-card">
            <div className="event-time">09:00 AM</div>
            <div className="event-details">
              <h3>ByteCraft Hackathon Kickoff</h3>
              <div className="event-meta">
                <span className="event-category">Development</span>
                <span className="event-venue">Software Lab 1</span>
              </div>
            </div>
            <span className="event-badge live">24 HR</span>
          </div>
          <div className="event-card">
            <div className="event-time">10:30 AM</div>
            <div className="event-details">
              <h3>Architecting the Metaverse: Web3 &amp; Beyond</h3>
              <div className="event-meta">
                <span className="event-category">Keynote Talk</span>
                <span className="event-venue">Pascal Hall</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">11:15 AM</div>
            <div className="event-details">
              <h3>UI/UX Figma Wars</h3>
              <div className="event-meta">
                <span className="event-category">Design Match</span>
                <span className="event-venue">Language Lab</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">01:30 PM</div>
            <div className="event-details">
              <h3>Neural Networks &amp; Deep Learning Essentials</h3>
              <div className="event-meta">
                <span className="event-category">Workshop</span>
                <span className="event-venue">AI Lab</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">03:00 PM</div>
            <div className="event-details">
              <h3>Algorithmic Combat (Speed Coding Sprint)</h3>
              <div className="event-meta">
                <span className="event-category">Competition</span>
                <span className="event-venue">CCF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Day 2 */}
      <div className="day-section">
        <div className="day-header">
          <span className="day-number">02</span>
          <div className="day-info">
            <h2>Thursday</h2>
            <p>October 15, 2027</p>
          </div>
          <div className="day-line" />
        </div>
        <div className="event-cards">
          <div className="event-card">
            <div className="event-time">09:00 AM</div>
            <div className="event-details">
              <h3>Hackathon Judgement &amp; Project Pitches</h3>
              <div className="event-meta">
                <span className="event-category">Evaluation</span>
                <span className="event-venue">Software Lab 2</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">10:00 AM</div>
            <div className="event-details">
              <h3>Cyber Crypt (Capture The Flag Jeopardy)</h3>
              <div className="event-meta">
                <span className="event-category">Cybersecurity</span>
                <span className="event-venue">Software Lab 4</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">11:30 AM</div>
            <div className="event-details">
              <h3>The Quantum Leap: Next Gen AI</h3>
              <div className="event-meta">
                <span className="event-category">Expert Talk</span>
                <span className="event-venue">Aryabhatta Hall</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">01:30 PM</div>
            <div className="event-details">
              <h3>Prompt Engineering Masterclass</h3>
              <div className="event-meta">
                <span className="event-category">Hands-on Session</span>
                <span className="event-venue">AI Lab</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">03:30 PM</div>
            <div className="event-details">
              <h3>AI Prompt Battle Arena</h3>
              <div className="event-meta">
                <span className="event-category">Competition</span>
                <span className="event-venue">Software Lab 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Day 3 */}
      <div className="day-section">
        <div className="day-header">
          <span className="day-number">03</span>
          <div className="day-info">
            <h2>Friday</h2>
            <p>October 16, 2027</p>
          </div>
          <div className="day-line" />
        </div>
        <div className="event-cards">
          <div className="event-card">
            <div className="event-time">09:30 AM</div>
            <div className="event-details">
              <h3>Robo-Code: Autonomous Maze Solvers</h3>
              <div className="event-meta">
                <span className="event-category">Robotics</span>
                <span className="event-venue">CCF</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">11:00 AM</div>
            <div className="event-details">
              <h3>Silicon Valley Mindset &amp; Tech Startup Panel</h3>
              <div className="event-meta">
                <span className="event-category">Fireside Chat</span>
                <span className="event-venue">Senatus Hall</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">01:30 PM</div>
            <div className="event-details">
              <h3>Bug Hunting Championship</h3>
              <div className="event-meta">
                <span className="event-category">Debugging Race</span>
                <span className="event-venue">Software Lab 1</span>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="event-time">03:30 PM</div>
            <div className="event-details">
              <h3>HASH '27 Valedictory &amp; Award Ceremony</h3>
              <div className="event-meta">
                <span className="event-category">Closing Ceremony</span>
                <span className="event-venue">Amenity Center</span>
              </div>
            </div>
            <span className="event-badge closing">FINAL</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</>
  );
}
