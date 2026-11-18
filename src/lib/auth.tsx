import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AppUser {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  plan: string;
}

interface AuthContextValue {
  user: AppUser | null;
  ready: boolean;
  login: (user: AppUser) => void;
  logout: () => void;
  update: (patch: Partial<AppUser>) => void;
}

const STORAGE_KEY = "legaldoc.user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      /* abaikan data tidak valid */
    }
    setReady(true);
  }, []);

  const login = useCallback((next: AppUser) => {
    setUser(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const update = useCallback((patch: Partial<AppUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout, update }), [user, ready, login, logout, update]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
