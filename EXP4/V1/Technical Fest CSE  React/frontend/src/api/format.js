/** "October 14, 2027 – October 16, 2027" from the schedule payload's days. */
export function dateRange(days = []) {
  const labels = days.map((d) => d.dateLabel).filter(Boolean);
  if (!labels.length) return "Dates to be announced";
  return labels.length === 1 ? labels[0] : `${labels[0]} – ${labels[labels.length - 1]}`;
}

export function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/** ISO string -> value for <input type="datetime-local"> (local time). */
export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
