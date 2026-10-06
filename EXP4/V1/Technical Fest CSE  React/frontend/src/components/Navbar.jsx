import React, { useState } from "react";

const links = [
  ["/", "HOME"],
  ["/events", "EVENTS"],
  ["/register", "REGISTER"],
  ["/gallery", "GALLERY"],
  ["/team", "TEAM"],
  ["/sponsors", "SPONSORS"],
  ["/contact", "CONTACT"],
  ["/account", "ACCOUNT"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setOpen(false);
  };

  return (
    <nav id="navbar">
      <button
        type="button"
        className="hamburger"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-links${open ? " is-open" : ""}`}>
        {links.map(([path, label]) => (
          <a
            key={path}
            href={path}
            onClick={(e) => {
              e.preventDefault();
              go(path);
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
