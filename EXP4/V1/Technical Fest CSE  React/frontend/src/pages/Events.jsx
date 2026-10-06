import React from "react";
import { api } from "../api/client";
import { useApi } from "../hooks/useApi";
import Status from "../components/Status";

export default function Events() {
  const { data, error, loading, reload } = useApi((signal) => api.schedule(signal), []);
  const days = data?.data?.days ?? [];

  return (
    <>
      <div className="events-bg" />
      <header id="heroNonHome">
        <h1>EVENT SCHEDULE</h1>
        <p className="schedule-subtitle">Three days of innovation, code, and tech excellence</p>
      </header>
      <main id="events-page">
        <div className="schedule-container">
          <Status loading={loading} error={error} onRetry={reload} what="schedule" />
          {days.map((d) => (
            <div className="day-section" key={d.day}>
              <div className="day-header">
                <span className="day-number">{String(d.day).padStart(2, "0")}</span>
                <div className="day-info">
                  <h2>{d.weekday || `Day ${d.day}`}</h2>
                  <p>{d.dateLabel}</p>
                </div>
                <div className="day-line" />
              </div>
              <div className="event-cards">
                {d.events.map((e) => (
                  <div className="event-card" key={e.id}>
                    <div className="event-time">{e.time}</div>
                    <div className="event-details">
                      <h3>{e.title}</h3>
                      <div className="event-meta">
                        <span className="event-category">{e.category}</span>
                        <span className="event-venue">{e.venue}</span>
                      </div>
                    </div>
                    {e.badgeText && <span className={`event-badge ${e.badgeStyle || ""}`}>{e.badgeText}</span>}
                    {e.isFull && <span className="event-badge closing">FULL</span>}
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
