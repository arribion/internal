import axios from "axios";

// 1. Grab the base URL from Vite's environment variables
const baseURL = import.meta.env.VITE_API_URL;

// 2. Create the custom Axios instance
const api = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// 4. Optional: Add response interceptor (e.g., handle global errors)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.AUTH_CODE === "TRY_REFRESH"
    ) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Unauthorized! Refreshing...");
      await fetch(`${baseURL}/api/v1/auth/team/refresh`, {
        method: "POST",
        credentials: "include",
      });
    }
    return Promise.reject(error);
  },
);

export default api;
