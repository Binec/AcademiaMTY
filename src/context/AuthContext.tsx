import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as api from "../services/api";
import { CourseLevel } from "../data/site";
import { DbUser } from "../services/db";

export type User = DbUser;

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refresh: () => void;
  hasAccess: (level: CourseLevel) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => setUser(api.getSession());

  useEffect(() => {
    // Inicializa semilla admin y sesión actual
    (async () => {
      try {
        const { ensureSeed } = await import("../services/db");
        await ensureSeed();
      } catch (e) {
        console.error("Seed error", e);
      }
      refresh();
      setLoading(false);
    })();
  }, []);

  const signUp: AuthState["signUp"] = async (data) => {
    const res = await api.signUp(data);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.user);
    return { ok: true };
  };

  const login: AuthState["login"] = async (email, password) => {
    const res = await api.signIn(email, password);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.user);
    return { ok: true };
  };

  const logout = () => {
    api.signOut();
    setUser(null);
  };

  const hasAccess = (level: CourseLevel) => api.hasAccessTo(level);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        login,
        logout,
        refresh,
        hasAccess,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
