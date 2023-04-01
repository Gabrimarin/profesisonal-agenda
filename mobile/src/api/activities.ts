import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { Activity } from "../models/Activity";

export async function getActivities(): Promise<AxiosResponse<Activity[]>> {
  return api.get("/activities");
}

export async function getActivity(
  id: string
): Promise<AxiosResponse<Activity>> {
  return api.get(`/activities/${id}`);
}

export async function createActivity(activity: Activity) {
  return api.post("/activities", activity);
}

export async function updateActivity(id: string, activity: Activity) {
  return api.put(`/activities/${id}`, activity);
}

export async function deleteActivity(id: string) {
  return api.delete(`/activities/${id}`);
}

export async function toggleActivityDone(id: string) {
  return api.put(`/activities/${id}/toggle_done`);
}
