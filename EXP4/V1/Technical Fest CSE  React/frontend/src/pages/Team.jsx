import React from "react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import Status from "../components/Status";
import SafeImage from "../components/SafeImage";

export default function Team() {
  const { data, error, loading, reload } = useApi((signal) => api.team(signal), []);
  const sections = data?.data ?? [];

  return (
    <>
      <header id="heroNonHome">
        <h1>MEET THE TEAM</h1>
        <p className="schedule-subtitle">The minds behind HASH '27</p>
      </header>
      <main id="team-page">
        <div className="team-container">
          <Status loading={loading} error={error} onRetry={reload} what="team" />
          {sections.map((s) => (
            <div className="team-section" key={s.key}>
              <h2 className="team-section-title">{s.title}</h2>
              <div className={`team-grid${s.patron ? " patrons" : ""}`}>
                {s.members.map((m) => (
                  <div className={`team-card${s.patron ? " patron" : ""}`} key={m.id}>
                    <div className="team-card-photo">
                      <SafeImage src={m.photoUrl} alt={m.name} />
                    </div>
                    <div className="team-card-info">
                      <h3>{m.name}</h3>
                      <span className="team-role">{m.role}</span>
                      {m.department && <p className="team-dept">{m.department}</p>}
                    </div>
                    <div className="team-card-glow" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
