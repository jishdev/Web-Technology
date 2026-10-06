import React, { useState } from "react";
import { assetUrl } from "../api/client";

const initials = (text = "") =>
  text
    .replace(/^(Ms|Mr|Dr|Mrs)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/** <img> that falls back to initials when the file is missing (many placeholder photos/logos aren't uploaded yet). */
export default function SafeImage({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="img-fallback" role="img" aria-label={alt}>
        {initials(fallback || alt)}
      </span>
    );
  }
  return <img src={assetUrl(src)} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
