import React, { useState } from "react";
import { api } from "../../api/client";
import { formatDateTime } from "../../api/format";
import { useApi } from "../../hooks/useApi";
import Status from "../../components/Status";

function EventRow({ e, onSaved }) {
  const [capacity, setCapacity] = useState(String(e.capacity));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const save = async (patch) => {
    setBusy(true);
    setErr("");
    try {
      await api.admin.updateEvent(e.id, patch);
      onSaved();
    } catch (er) {
      setErr(er.message);
    } finally {
      setBusy(false);
    }
  };

  const dirty = capacity !== String(e.capacity);
  return (
    <tr>
      <td>Day {e.day}</td>
      <td>{e.title}</td>
      <td>{e.registered}{e.capacity > 0 ? ` / ${e.capacity}` : ""}</td>
      <td>
        <input className="admin-num" type="number" min="0" value={capacity} onChange={(ev) => setCapacity(ev.target.value)} aria-label={`Capacity for ${e.title}`} title="0 = unlimited" />
        {dirty && (
          <button type="button" className="admin-btn" disabled={busy} onClick={() => save({ capacity: Number(capacity) })}>
            Save
          </button>
        )}
        {err && <span className="field-error">{err}</span>}
      </td>
      <td>
        <label className="admin-check">
          <input type="checkbox" checked={e.isActive} disabled={busy} onChange={(ev) => save({ isActive: ev.target.checked })} />
          Open
        </label>
      </td>
    </tr>
  );
}

export default function Overview() {
  const { data, error, loading, reload } = useApi((signal) => api.admin.stats(signal), []);
  const s = data?.data;
  return (
    <>
      <h3>Overview</h3>
      <Status loading={loading} error={error} onRetry={reload} what="stats" />
      {s && (
        <>
          <div className="admin-stat-grid">
            <div className="admin-stat"><strong>{s.totals.registrations}</strong><span>Registrations</span></div>
            <div className="admin-stat"><strong>{s.totals.events}</strong><span>Events</span></div>
            <div className="admin-stat"><strong>{s.totals.newMessages}</strong><span>New messages</span></div>
            <div className="admin-stat"><strong>{s.totals.cancelledRegistrations}</strong><span>Cancelled</span></div>
          </div>

          <h4>Events &amp; seats</h4>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Day</th><th>Event</th><th>Registered</th><th>Capacity (0 = unlimited)</th><th>Registration</th></tr></thead>
              <tbody>{s.byEvent.map((e) => <EventRow key={e.id} e={e} onSaved={reload} />)}</tbody>
            </table>
          </div>

          <div className="admin-two-col">
            <div>
              <h4>By year</h4>
              {s.byYear.length ? <ul className="admin-list">{s.byYear.map((y) => <li key={y.year}><span>{y.year}</span><b>{y.count}</b></li>)}</ul> : <p className="admin-empty">No data yet.</p>}
            </div>
            <div>
              <h4>Top departments</h4>
              {s.topDepartments.length ? <ul className="admin-list">{s.topDepartments.map((d) => <li key={d.department}><span>{d.department}</span><b>{d.count}</b></li>)}</ul> : <p className="admin-empty">No data yet.</p>}
            </div>
          </div>

          <h4>Latest registrations</h4>
          {s.recentRegistrations.length ? (
            <ul className="admin-list">
              {s.recentRegistrations.map((r) => (
                <li key={r.id}><span>{r.name} → {r.event?.title}</span><b>{formatDateTime(r.createdAt)}</b></li>
              ))}
            </ul>
          ) : <p className="admin-empty">No registrations yet.</p>}
        </>
      )}
    </>
  );
}
