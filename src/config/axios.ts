import axios from "axios";
import { useAuthStore } from "@/store/auth";

const instance = axios.create({
  baseURL: "http://localhost:8080", 
  withCredentials: true,
});


// Interceptor para agregar el token a las peticiones
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;