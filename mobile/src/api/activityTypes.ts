import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { ActivityType } from "../models/ActivityType";

export async function getActivityTypes(): Promise<
  AxiosResponse<ActivityType[]>
> {
  return api.get("/activities/types");
}

export async function getActivityType(
  id: string
): Promise<AxiosResponse<ActivityType>> {
  return api.get(`/activities/types/${id}`);
}

export async function createActivityType(
  activityType: ActivityType
): Promise<AxiosResponse<ActivityType>> {
  return api.post("/activities/types", activityType);
}

export async function updateActivityType(
  id: string,
  activityType: ActivityType
): Promise<AxiosResponse<ActivityType>> {
  return api.put(`/activities/types/${id}`, activityType);
}

export async function deleteActivityType(
  id: string
): Promise<AxiosResponse<ActivityType>> {
  return api.delete(`/activities/types/${id}`);
}
