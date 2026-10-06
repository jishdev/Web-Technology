import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteShell({ children }) {
  return (
    <>
      <div className="events-static-bg" aria-hidden="true" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
