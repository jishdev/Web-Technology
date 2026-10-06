import React, { useEffect, useState } from "react";
import SiteShell from "./components/SiteShell";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import Team from "./pages/Team";
import Sponsors from "./pages/Sponsors";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const routes = {
  "/": Home,
  "/events": Events,
  "/register": Register,
  "/gallery": Gallery,
  "/team": Team,
  "/sponsors": Sponsors,
  "/contact": Contact,
  "/admin": Admin,
  "/account": Account,
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Internal <a href="/..."> links navigate without a full page reload.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/api") || url.pathname.startsWith("/uploads")) return;
      e.preventDefault();
      window.history.pushState({}, "", url.pathname + url.search + url.hash);
      setPath(url.pathname);
      window.scrollTo(0, 0);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Make the old .html URLs work if somebody has bookmarks.
  const normalized = path.replace(/\.html$/, "") || "/";
  const Page = routes[normalized] || NotFound;

  return (
    <SiteShell>
      <Page />
    </SiteShell>
  );
}
