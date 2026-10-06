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
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
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
