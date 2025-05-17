import axios from "axios";

const apiClient = axios.create({
  baseURL: " https://btc5.thiraphat.online/backendapi/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// เพิ่ม interceptor เช่น ใส่ token ในทุก request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
