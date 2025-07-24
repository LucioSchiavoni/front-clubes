import { createUser } from "@/interface/create-user";
import { loginUser } from "@/interface/login-user";
import instance from "../config/axios";


export const loginRequest = async (data: loginUser) => {
  const response = await instance.post("/login", data);
  return response.data;
};

export const authRequest = () =>
  instance.get("/auth");

export const registerRequest = async (user: createUser) => {
  try {
    const response = await instance.post("/register", user);
    return response;
  } catch (error: any) {
    if (error.response?.status === 409) {
      return {
        data: error.response.data,
        status: 409
      };
    }
    throw error;
  }
};

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

export const changePasswordRequest = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    const response = await instance.patch("/change-password", {
      userId,
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error en changePasswordRequest:', error);
    throw error;
  }
}