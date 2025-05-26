import { createUser } from "@/interface/create-user";
import axios from "../config/axios";

export const loginRequest = (user: { email: string; password: string }) =>
  axios.post("/login", user);

export const authRequest = () =>
  axios.get("/auth");

export const registerRequest = (user: createUser) =>
    axios.post("/register", user);