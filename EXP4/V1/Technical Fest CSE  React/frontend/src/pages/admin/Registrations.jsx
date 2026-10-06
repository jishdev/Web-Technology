import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import { formatDateTime } from "../../api/format";
import { useApi } from "../../hooks/useApi";
import Status from "../../components/Status";

const LIMIT = 20;

export default function Registrations() {
  const [filters, setFilters] = useState({ event: "", status: "", q: "" });
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");
  const [exporting, setExporting] = useState(false);

  // debounce search box
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => (f.q === q ? f : { ...f, q }));
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const events = useApi((signal) => api.schedule(signal), []);
  const list = useApi(
    (signal) => api.admin.registrations({ ...filters, page, limit: LIMIT }, signal),
    [filters.event, filters.status, filters.q, page]
  );

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const allEvents = (events.data?.data?.days ?? []).flatMap((d) => d.events);

  const changeStatus = async (r, status) => {
    setActionError("");
    try {
      await api.admin.updateRegistration(r.id, { status });
      list.reload();
    } catch (e) {
      setActionError(e.message);
    }
  };
  const remove = async (r) => {
    if (!window.confirm(`Delete registration for ${r.name}? This cannot be undone.`)) return;
    setActionError("");
    try {
      await api.admin.deleteRegistration(r.id);
      list.reload();
    } catch (e) {
      setActionError(e.message);
    }
  };
  const exportCsv = async () => {
    setExporting(true);
    setActionError("");
    try {
      await api.admin.exportRegistrations({ ...filters });
    } catch (e) {
      setActionError(e.message);
    } finally {
      setExporting(false);
    }
  };
  const setFilter = (name) => (e) => {
    setFilters((f) => ({ ...f, [name]: e.target.value }));
    setPage(1);
  };

  return (
    <>
      <h3>Registrations {meta && <small>({meta.total})</small>}</h3>
      <div className="admin-toolbar">
        <select value={filters.event} onChange={setFilter("event")} aria-label="Filter by event">
          <option value="">All events</option>
          {allEvents.map((e) => <option key={e.id} value={e.slug}>{e.title}</option>)}
        </select>
        <select value={filters.status} onChange={setFilter("status")} aria-label="Filter by status">
          <option value="">Any status</option>
          <option value="confirmed">Confirmed</option>
          <option value="attended">Attended</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="search" placeholder="Search name, email, phone, code…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="admin-btn" onClick={exportCsv} disabled={exporting}>
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>
      {actionError && <p className="form-banner error" role="alert">{actionError}</p>}
      <Status loading={list.loading} error={list.error} onRetry={list.reload} what="registrations" />
      {!list.loading && !list.error && !rows.length && <p className="admin-empty">No registrations match.</p>}
      {rows.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Code</th><th>Name</th><th>Event</th><th>Contact</th><th>Year / Dept</th><th>Registered</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><code>{r.code}</code></td>
                  <td>{r.name}{r.teamName && <small className="admin-sub">Team: {r.teamName}</small>}</td>
                  <td>{r.event?.title}</td>
                  <td>{r.email}<small className="admin-sub">{r.phone}</small></td>
                  <td>{r.year} · {r.department}<small className="admin-sub">{r.institution}</small></td>
                  <td>{formatDateTime(r.createdAt)}</td>
                  <td>
                    <select value={r.status} onChange={(e) => changeStatus(r, e.target.value)} aria-label={`Status for ${r.name}`}>
                      <option value="confirmed">Confirmed</option>
                      <option value="attended">Attended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td><button type="button" className="admin-btn danger" onClick={() => remove(r)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && meta.pages > 1 && (
        <div className="admin-pager">
          <button type="button" className="admin-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span>Page {meta.page} of {meta.pages}</span>
          <button type="button" className="admin-btn" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}
    </>
  );
}
