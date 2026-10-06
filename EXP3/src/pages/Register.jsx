import React from "react";

export default function Register() {
  return (
<>
  {/* Static Gradient Background */}
  {/* Navigation Bar */}
  <header id="heroNonHome">
    <h1>REGISTER</h1>
    <p className="schedule-subtitle">Secure your spot at HASH '27</p>
  </header>
  <main id="register-page">
    <div className="register-container">
      <div className="register-layout">
        {/* Left: Event Info */}
        <div className="register-info-col">
          <div className="register-info-card">
            <div className="register-info-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x={3}
                  y={4}
                  width={18}
                  height={18}
                  rx={2}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 2V6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M8 2V6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
                <circle cx={8} cy={14} r={1} fill="currentColor" />
                <circle cx={12} cy={14} r={1} fill="currentColor" />
                <circle cx={16} cy={14} r={1} fill="currentColor" />
              </svg>
            </div>
            <h3>Event Dates</h3>
            <p>February 14 – 16, 2027</p>
          </div>
          <div className="register-info-card">
            <div className="register-info-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Venue</h3>
            <p>
              MBCET, Nalanchira
              <br />
              Thiruvananthapuram
            </p>
          </div>
          <div className="register-info-card">
            <div className="register-info-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
            <h3>Registration Closes</h3>
            <p>February 10, 27</p>
          </div>
          <a href="/events" className="back-to-events">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Full Schedule
          </a>
        </div>
        {/* Right: Registration Form */}
        <div className="register-form-col">
          <div className="register-form-card">
            <h2>Event Registration</h2>
            <p>Fill in your details to register for HASH '27</p>
            <form className="register-form" onsubmit="event.preventDefault();">
              {/* Event Selection */}
              <div className="form-group">
                <label>Select Event</label>
                <select required="">
                  <option value="">Choose an event...</option>
                  <optgroup label="Day 1 — Oct 14">
                    <option value="hackathon">
                      ByteCraft Hackathon Kickoff
                    </option>
                    <option value="web3-talk">
                      Architecting the Metaverse: Web3 &amp; Beyond
                    </option>
                    <option value="figma-wars">UI/UX Figma Wars</option>
                    <option value="dl-workshop">
                      Neural Networks &amp; Deep Learning Essentials
                    </option>
                    <option value="speed-coding">
                      Algorithmic Combat (Speed Coding Sprint)
                    </option>
                  </optgroup>
                  <optgroup label="Day 2 — Oct 15">
                    <option value="hackathon-judge">
                      Hackathon Judgement &amp; Project Pitches
                    </option>
                    <option value="ctf">Cyber Crypt (Capture The Flag)</option>
                    <option value="quantum-talk">
                      The Quantum Leap: Next Gen AI
                    </option>
                    <option value="prompt-masterclass">
                      Prompt Engineering Masterclass
                    </option>
                    <option value="ai-battle">AI Prompt Battle Arena</option>
                  </optgroup>
                  <optgroup label="Day 3 — Oct 16">
                    <option value="robo-maze">
                      Robo-Code: Autonomous Maze Solvers
                    </option>
                    <option value="startup-panel">
                      Silicon Valley Mindset &amp; Tech Startup Panel
                    </option>
                    <option value="bug-hunt">Bug Hunting Championship</option>
                    <option value="valedictory">
                      HASH '27 Valedictory &amp; Award Ceremony
                    </option>
                  </optgroup>
                </select>
              </div>
              {/* Personal Details */}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your full name" required="" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required=""
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    pattern="^[6-9]\d{9}$"
                    title="Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <label>Year of Study</label>
                  <select required="">
                    <option value="">Select year...</option>
                    <option value="S1">S1 — First Year</option>
                    <option value="S3">S3 — Second Year</option>
                    <option value="S5">S5 — Third Year</option>
                    <option value="S7">S7 — Final Year</option>
                    <option value="PG">Postgraduate</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. CSE, ECE, ME"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <label>Institution</label>
                  <input type="text" placeholder="College name" required="" />
                </div>
              </div>
              {/* Team Details (for Hackathon) */}
              <div className="form-group">
                <label>
                  Team Name <span className="optional">(Hackathon only)</span>
                </label>
                <input type="text" placeholder="If registering as a team" />
              </div>
              {/* Submit */}
              <button type="submit" className="register-submit-btn">
                <span>Complete Registration</span>
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
      </div>
    </div>
  </main>
</>
  );
}
