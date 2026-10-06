import React, { useEffect, useState } from "react";
import { api } from "../../api/client";
import { toLocalInput } from "../../api/format";
import { useApi } from "../../hooks/useApi";
import Status from "../../components/Status";

export default function SettingsPanel() {
  const { data, error, loading, reload } = useApi((signal) => api.admin.settings(signal), []);
  const [open, setOpen] = useState(true);
  const [closesAt, setClosesAt] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = data?.data;
    if (s) {
      setOpen(s.registrationOpen);
      setClosesAt(toLocalInput(s.registrationClosesAt));
    }
  }, [data]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api.admin.updateSettings({
        registrationOpen: open,
        registrationClosesAt: closesAt ? new Date(closesAt).toISOString() : null,
      });
      setMsg({ type: "success", text: "Settings saved." });
      reload();
    } catch (er) {
      setMsg({ type: "error", text: er.message });
    } finally {
      setBusy(false);
    }
  };

  const live = data?.data?.registrationCurrentlyOpen;
  return (
    <>
      <h3>Settings</h3>
      <Status loading={loading} error={error} onRetry={reload} what="settings" />
      {data && (
        <form className="admin-settings" onSubmit={save}>
          <p>
            Registration is currently <strong className={live ? "ok" : "bad"}>{live ? "OPEN" : "CLOSED"}</strong> for the public.
          </p>
          <label className="admin-check">
            <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
            Accept registrations
          </label>
          <div className="form-group">
            <label htmlFor="closes-at">Registration deadline (optional)</label>
            <input id="closes-at" type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
            <small className="admin-sub">Leave empty for no deadline. Uses your browser's time zone.</small>
          </div>
          {msg && <p className={`form-banner ${msg.type}`} role={msg.type === "error" ? "alert" : "status"}>{msg.text}</p>}
          <button type="submit" className="register-submit-btn" disabled={busy}>
            <span>{busy ? "Saving…" : "Save settings"}</span>
          </button>
        </form>
      )}
    </>
  );
}
