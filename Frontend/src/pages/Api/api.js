import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

// ---------------------
// TOKEN REFRESH LOGIC
// ---------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ---------------------
// RESPONSE INTERCEPTOR
// ---------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If ACCESS TOKEN expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh-token API
        const { data } = await api.post("/users/refresh-token");

        const newToken = data.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newToken);

        // Attach new token to all requests
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Retry original request
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
