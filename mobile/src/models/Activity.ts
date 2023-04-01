import { ActivityType } from "./ActivityType";
import { Client } from "./Client";

export type Activity = {
  id?: number;
  name: string;
  client?: Client;
  clientId: number;
  activityType?: ActivityType;
  activityTypeId?: number;
  dateStart: Date;
  dateEnd?: Date;
  done: boolean;
  price?: number;
};
