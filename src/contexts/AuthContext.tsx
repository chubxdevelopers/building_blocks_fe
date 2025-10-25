import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../utils/axiosConfig";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company?: string;
  team?: string;
  uiPermissions?: any[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  getHomePath: () => string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  getHomePath: () => "/login",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/verify")
        .then((response) => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getHomePath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return user.company ? `/${user.company}/admin` : "/admin";
      case "user":
        return "/dashboard";
      case "manager":
        return "/manager/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, getHomePath }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
