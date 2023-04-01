import axios from "axios";
import { getValueFor } from "./storage";

export const api = axios.create({
  baseURL: "http://192.168.1.7:3333",
});

api.interceptors.request.use(async (config) => {
  const token = await getValueFor("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
