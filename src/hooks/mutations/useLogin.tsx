import { useMutation } from "@tanstack/react-query";
import api from "@/config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export function useLogin() {
    const navigate = useNavigate();
    const {setUser} = useAuth()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>(
        "/api/v1/auth/team/login",
        credentials,
      );
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Login successful!");
      navigate("/dashboard"); // adjust route as needed
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      toast.error(message);
    },
  });
}
