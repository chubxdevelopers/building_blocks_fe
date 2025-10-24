import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../utils/axiosConfig";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
