import axios from "axios";
import { getValueFor } from "./storage";
import { BASE_URL_DEV, BASE_URL_PROD } from "@env";
const isDev = false;
const baseURL = isDev ? BASE_URL_DEV : BASE_URL_PROD;
export const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  async (config) => {
    console.log(config);
    const token = await getValueFor("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
