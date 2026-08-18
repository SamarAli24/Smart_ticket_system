import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { authTokenStore, setUnauthorizedHandler } from "../services/httpClient";
import { userDtoToAgentUser } from "../services/adapters";
import type { AgentUser } from "../types";

const SESSION_KEY = "smart-support.session";

interface StoredSession {
  token: string;
  user: AgentUser;
}

interface AuthContextValue {
  currentUser: AgentUser | null;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AgentUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const clearSession = () => {
      sessionStorage.removeItem(SESSION_KEY);
      authTokenStore.set(null);
      setCurrentUser(null);
    };

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const session = JSON.parse(stored) as StoredSession;
        authTokenStore.set(session.token);
        setCurrentUser(session.user);
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    setIsInitializing(false);

    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    const agentUser = userDtoToAgentUser(user);
    authTokenStore.set(token);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: agentUser }));
    setCurrentUser(agentUser);
  };

  const logout = () => {
    authService.logout().catch(() => {});
    sessionStorage.removeItem(SESSION_KEY);
    authTokenStore.set(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isInitializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
