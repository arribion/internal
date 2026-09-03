# works but old tech :}

 ```ts
 import { useMutation } from "@tanstack/react-query";
 import api from "@/config/api";
 import { useNavigate } from "react-router-dom";
 import toast from "react-hot-toast";
 import { useAuth } from "@/context/AuthContext";
 import { useReturnTo } from "../useReturnTo";

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


     onSuccess: (data: any) => {
       const userData = data?.user || data?.me || data;

       const fallbackUser = {
         ...userData,
         roles: userData?.roles || [],
         name: userData?.name || "User",
       };

       setUser(fallbackUser);
       toast.success("Login successful!");

       const params = new URLSearchParams(window.location.search);
       const redirectTo = params.get("returnTo") || "/dashboard";
       navigate(redirectTo, { replace: true });
     },
     onError: (error: any) => {
       const message =
         error?.response?.data?.message ||
         "Registration failed. Please try again.";
       toast.error(message);
     },
   });
 }
```
