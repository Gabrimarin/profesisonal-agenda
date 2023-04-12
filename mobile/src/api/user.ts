import { api } from "../lib/axios";
import { User } from "../models/User";

export async function createUser(user: User) {
  return api.post("/users", user);
}

export async function updateProfilePicture(url?: string) {
  return api.put("/users/profile_picture", { url });
}
