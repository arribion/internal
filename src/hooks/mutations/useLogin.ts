import { useMutation } from "@tanstack/react-query";
import api from "@/config/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useReturnTo } from "../useReturnTo";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export function useLogin() {
  const rt = useReturnTo();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>(
        "/api/v1/auth/team/login",
        credentials,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful!");
      rt.redirectToTarget(); 
      refreshUser();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      toast.error(message);
    },
  });
}
