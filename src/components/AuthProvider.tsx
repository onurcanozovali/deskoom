"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type AuthProviderName = "demo" | "google" | "facebook";

export type DemoUser = {
  name: string;
  email: string;
  provider: AuthProviderName;
};

type AuthContextValue = {
  user: DemoUser | null;
  ready: boolean;
  isAuthenticated: boolean;
  signIn: (provider?: AuthProviderName) => void;
  signOut: () => void;
};

const STORAGE_KEY = "deskoom-session-v1";
const DEMO_USER: DemoUser = { name: "Admin Demo", email: "admin@admin.com", provider: "demo" };
const AuthContext = createContext<AuthContextValue | null>(null);
const authListeners = new Set<() => void>();
let authSnapshot: DemoUser | null = null;
let authInitialized = false;

function readStoredUser(): DemoUser | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Partial<DemoUser>;
    if (typeof candidate.name !== "string" || typeof candidate.email !== "string") return null;
    if (candidate.provider !== "demo" && candidate.provider !== "google" && candidate.provider !== "facebook") return null;
    return { name: candidate.name, email: candidate.email, provider: candidate.provider };
  } catch {
    return null;
  }
}

function emitAuthChange() {
  authListeners.forEach((listener) => listener());
}

function getAuthSnapshot() {
  if (!authInitialized && typeof window !== "undefined") {
    authSnapshot = readStoredUser();
    authInitialized = true;
  }
  return authSnapshot;
}

function getServerAuthSnapshot() {
  return null;
}

function setAuthSnapshot(user: DemoUser | null) {
  authSnapshot = user;
  authInitialized = true;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
  emitAuthChange();
}

function subscribeToAuth(listener: () => void) {
  authListeners.add(listener);
  const syncAuth = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    authSnapshot = readStoredUser();
    authInitialized = true;
    emitAuthChange();
  };
  window.addEventListener("storage", syncAuth);
  return () => {
    authListeners.delete(listener);
    window.removeEventListener("storage", syncAuth);
  };
}

function subscribeToHydration() {
  return () => undefined;
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerAuthSnapshot);
  const ready = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydratedSnapshot);
  const signIn = useCallback((provider: AuthProviderName = "demo") => {
    setAuthSnapshot({ ...DEMO_USER, provider });
  }, []);
  const signOut = useCallback(() => setAuthSnapshot(null), []);
  const value = useMemo(() => ({ user, ready, isAuthenticated: Boolean(user), signIn, signOut }), [user, ready, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  return context;
}
