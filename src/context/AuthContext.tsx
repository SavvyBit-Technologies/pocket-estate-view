
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

// Define types for our authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
}

interface UserData {
  username: string;
  email: string;
  estate: string;
  estate_id: number;
  is_admin: boolean;
}

// Define the context interface
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  estate_name: string;
  estate_address: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Base API URL
export const API_URL = "https://estate-backend-2yo8.onrender.com/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          user: parsedUser,
          token: token
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      
      // Save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        username: data.username,
        email: data.email,
        estate: data.estate,
        estate_id: data.estate_id,
        is_admin: data.is_admin
      }));

      setAuthState({
        isAuthenticated: true,
        user: {
          username: data.username,
          email: data.email,
          estate: data.estate,
          estate_id: data.estate_id,
          is_admin: data.is_admin
        },
        token: data.token,
      });

      toast.success(`Welcome back, ${data.username}!`);

      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Something went wrong"
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      await response.json();
      
      toast.success("Registration successful", {
        description: "You can now login with your credentials"
      });

      navigate("/login");
    } catch (error) {
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Something went wrong"
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
