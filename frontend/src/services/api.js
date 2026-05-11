import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Otomatis sisipkan token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Redirect ke login jika token expired/invalid
api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.message}`, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
