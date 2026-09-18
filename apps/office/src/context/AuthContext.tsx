import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/config/api";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authStatus: AuthStatus;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await api.post(`api/v1/auth/team/refresh`);
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const getMe = async () => {
    try {
      const { data } = await api.post("/api/v1/auth/team/me");
      setUser(data.me);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    (async () => getMe())();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/auth/team/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      toast.success("Logged out successfully");
    }
  };

  const authStatus: AuthStatus = isLoading
    ? "loading"
    : user
      ? "authenticated"
      : "unauthenticated";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authStatus,
        isLoading,
        login,
        logout,
        refreshUser,
        setUser,
      }}
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
