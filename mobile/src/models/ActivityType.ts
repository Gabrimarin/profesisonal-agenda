import { Activity } from "./Activity";
import { User } from "./User";

export type ActivityType = {
  id?: number;
  name: string;
  activities?: Activity[];
  user?: User;
  userId: number;
};
