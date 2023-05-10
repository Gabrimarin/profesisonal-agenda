import axios from "axios";
import { api } from "../lib/axios";
import { User } from "../models/User";

export async function login(user: User) {
  return api.post("/auth/login", user);
}

export async function getUser() {
  return api.get("/auth/me", {
    timeout: 1000,
  });
}
