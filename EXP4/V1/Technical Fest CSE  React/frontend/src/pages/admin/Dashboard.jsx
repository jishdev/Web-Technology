import React, { useState } from "react";
import Overview from "./Overview";
import Registrations from "./Registrations";
import Messages from "./Messages";
import SettingsPanel from "./SettingsPanel";

const TABS = [
  ["overview", "Overview"],
  ["registrations", "Registrations"],
  ["messages", "Messages"],
  ["settings", "Settings"],
];

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <>
      <div className="admin-tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className={`admin-tab${tab === key ? " active" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="register-form-card admin-panel">
        {tab === "overview" && <Overview />}
        {tab === "registrations" && <Registrations />}
        {tab === "messages" && <Messages />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </>
  );
}
