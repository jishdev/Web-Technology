import React, { createContext, useContext, useEffect, useState } from "react";
import { api, userTokenStore } from "../api/client";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(userTokenStore.get()));

  useEffect(() => {
    if (!userTokenStore.get()) return undefined;
    const c = new AbortController();
    api.user
      .me(c.signal)
      .then((r) => setUser(r.data))
      .catch(() => {})
      .finally(() => setChecking(false));
    return () => c.abort();
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener("hash27:user-unauthorized", onUnauthorized);
    return () => window.removeEventListener("hash27:user-unauthorized", onUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.user.login(email, password);
    userTokenStore.set(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (body) => {
    const res = await api.user.signup(body);
    userTokenStore.set(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    userTokenStore.clear();
    setUser(null);
  };

  const refresh = async () => {
    const res = await api.user.me();
    setUser(res.data);
    return res.data;
  };

  return (
    <AccountContext.Provider value={{ user, checking, login, signup, logout, refresh }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
