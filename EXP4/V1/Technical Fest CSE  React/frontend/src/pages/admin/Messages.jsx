import React, { useState } from "react";
import { api } from "../../api/client";
import { formatDateTime } from "../../api/format";
import { useApi } from "../../hooks/useApi";
import Status from "../../components/Status";

export default function Messages() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");
  const list = useApi((signal) => api.admin.messages({ status, page, limit: 20 }, signal), [status, page]);
  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;

  const act = async (fn) => {
    setActionError("");
    try {
      await fn();
      list.reload();
    } catch (e) {
      setActionError(e.message);
    }
  };

  return (
    <>
      <h3>Messages {meta && <small>({meta.total})</small>}</h3>
      <div className="admin-toolbar">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      {actionError && <p className="form-banner error" role="alert">{actionError}</p>}
      <Status loading={list.loading} error={list.error} onRetry={list.reload} what="messages" />
      {!list.loading && !list.error && !rows.length && <p className="admin-empty">No messages.</p>}
      <div className="admin-messages">
        {rows.map((m) => (
          <article key={m.id} className={`admin-message ${m.status}`}>
            <header>
              <div>
                <strong>{m.subject}</strong>
                <small className="admin-sub">{m.name} · <a href={`mailto:${m.email}`}>{m.email}</a> · {formatDateTime(m.createdAt)}</small>
              </div>
              <span className={`admin-pill ${m.status}`}>{m.status}</span>
            </header>
            <p>{m.message}</p>
            <footer>
              {m.status !== "read" && <button type="button" className="admin-btn" onClick={() => act(() => api.admin.updateMessage(m.id, "read"))}>Mark read</button>}
              {m.status !== "resolved" && <button type="button" className="admin-btn" onClick={() => act(() => api.admin.updateMessage(m.id, "resolved"))}>Resolve</button>}
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => window.confirm("Delete this message?") && act(() => api.admin.deleteMessage(m.id))}
              >
                Delete
              </button>
            </footer>
          </article>
        ))}
      </div>
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
