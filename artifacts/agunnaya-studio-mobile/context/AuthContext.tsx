import React, { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL, clearSession, getSession, saveSession } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

const AUTH_URL = `${BASE_URL}/api/auth`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const storedCookie = await getSession();
      if (!storedCookie) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: { Cookie: storedCookie },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) setUser(data.user);
        else await clearSession();
      } else {
        await clearSession();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    try {
      const res = await fetch(`${AUTH_URL}/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: body?.message || "Invalid credentials" };
      }
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        const match = setCookie.match(/better-auth\.session_token=[^;]+/);
        if (match) await saveSession(match[0]);
      }
      const data = await res.json();
      if (data?.user) setUser(data.user);
      return {};
    } catch (e: unknown) {
      return { error: "Network error" };
    }
  }

  async function signUp(email: string, password: string, name: string): Promise<{ error?: string }> {
    try {
      const res = await fetch(`${AUTH_URL}/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: body?.message || "Sign up failed" };
      }
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        const match = setCookie.match(/better-auth\.session_token=[^;]+/);
        if (match) await saveSession(match[0]);
      }
      const data = await res.json();
      if (data?.user) setUser(data.user);
      return {};
    } catch {
      return { error: "Network error" };
    }
  }

  async function signOut() {
    try {
      const storedCookie = await getSession();
      await fetch(`${AUTH_URL}/sign-out`, {
        method: "POST",
        headers: storedCookie ? { Cookie: storedCookie } : {},
      });
    } catch {
      // ignore
    } finally {
      await clearSession();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
