import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // Optional: Set timeout
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;
