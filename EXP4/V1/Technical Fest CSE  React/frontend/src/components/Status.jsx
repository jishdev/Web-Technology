import React from "react";

/** Loading / error placeholder shared by the data-driven pages. */
export default function Status({ loading, error, onRetry, what = "content" }) {
  if (loading) return <p className="status-msg" role="status">Loading {what}…</p>;
  if (error) {
    return (
      <div className="status-msg error" role="alert">
        <p>{error.message}</p>
        {onRetry && (
          <button type="button" className="cta-button" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }
  return null;
}
