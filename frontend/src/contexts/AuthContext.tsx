import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { authApi, RegisterData, User, usersApi } from "@/services/api";

interface AuthContextType {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await usersApi.getCurrentUser();
      setUser(response);
      setIsAuthenticated(true);
      console.log("settung isAuthenticated to true");
    } catch (error) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const register = async (data: RegisterData) => {
    await authApi.register(data);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });

      localStorage.setItem("token", response.access_token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.access_token}`;
      await fetchUser();
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
