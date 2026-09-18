import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

// ----- Refresh token state -----
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 with TRY_REFRESH and only once per request
    if (
      error.response?.status === 401 &&
      error.response?.data?.AUTH_CODE === "TRY_REFRESH" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // After refresh, retry the request (cookies are already updated)
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint – cookies will be updated automatically
        await api.post("/api/v1/auth/team/refresh", null, {
          withCredentials: true,
        });

        // Refresh succeeded – process queue and retry original request
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed – clear cookies / redirect to login
        processQueue(refreshError);
        // Optionally: clear session and redirect
        console.error("Refresh token failed, redirecting to login.");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, reject as usual
    return Promise.reject(error);
  },
);

export default api;