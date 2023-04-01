import { api } from "../lib/axios";
import { User } from "../models/User";

export async function createUser(user: User) {
  return api.post("/users", user);
}
