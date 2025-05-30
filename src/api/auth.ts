import { createUser } from "@/interface/create-user";
import { loginUser } from "@/interface/login-user";
import instance from "../config/axios";


export const loginRequest = async (data: loginUser) => {
  const response = await instance.post("/login", data);
  return response.data;
};

export const authRequest = () =>
  instance.get("/auth");

export const registerRequest = (user: createUser) =>
    instance.post("/register", user);

export const getSociosRequest = async (clubId: string) => {
  try {
    const response = await instance.get(`/socios/${clubId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getSociosRequest:', error);
    throw error;
  }
};