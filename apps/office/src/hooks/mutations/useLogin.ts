import { useMutation } from "@tanstack/react-query";
import api from "@/config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";

interface RegisterCredentials {
  name?: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    roles?: string[];
  };
}

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await api.post<RegisterResponse>(
        "/api/v1/auth/team/login",
        credentials,
      );
      return data;
    },

    onSuccess: (data) => {
      const userData = data?.user; //|| data?.me || data;

      const fallbackUser = {
        ...userData,
        roles: userData?.roles || [],
        name: userData?.name || "User",
      };

      setUser(fallbackUser);
      toast.success("Login successful!");

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("returnTo") || "/tasks";
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error?.response?.data?.message
          : "Registration failed. Please try again.";
      toast.error(message);
    },
  });
}
