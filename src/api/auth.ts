import { createUser } from "@/interface/create-user";
import axios from "../config/axios";
import { loginUser } from "@/interface/login-user";


export const loginRequest = async (data: loginUser) => {
  const response = await axios.post("/login", data);
  return response.data;
};

export const authRequest = () =>
  axios.get("/auth");

export const registerRequest = (user: createUser) =>
    axios.post("/register", user);