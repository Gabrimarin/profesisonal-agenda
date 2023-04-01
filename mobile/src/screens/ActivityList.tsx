import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { getActivities, toggleActivityDone } from "../api/activities";
import { Button } from "../components/Button";
import { UncontrolledCheckbox } from "../components/inputs/Checkbox";
import { useToast } from "../components/Toast";
import { Activity } from "../models/Activity";

interface ActivityListItemProps extends TouchableOpacityProps {
  activity: Activity;
  onToggleDone: (activity: Activity) => void;
}

function ActivityListItem({
  activity,
  onToggleDone,
  ...rest
}: ActivityListItemProps) {
  const { name, activityType, client, dateStart, done } = activity;
  return (
    <TouchableOpacity
      className="p-2 my-2 border-2 rounded-lg bg-white flex-row justify-between items-center"
      {...rest}
    >
      <View>
        <Text className="text-lg font-semibold">{name}</Text>
        <Text className="text-sm">
          <Feather name="tag" size={16} color="black" />{" "}
          {activityType?.name ?? "Sem categoria"}
        </Text>
        <Text className="text-sm">
          <Feather name="user" size={16} color="black" />{" "}
          {client?.name ?? "Sem cliente"}
        </Text>
        <Text className="text-sm">
          <Feather name="calendar" size={16} color="black" />{" "}
          {dayjs(dateStart).format("DD/MM/YYYY HH:mm")}
        </Text>
      </View>
      <UncontrolledCheckbox
        onPress={() => {
          onToggleDone(activity);
        }}
        checked={done}
      />
    </TouchableOpacity>
  );
}

export function ActivityList() {
  const { navigate } = useNavigation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
  const [togglingDone, setTogglingDone] = useState(false);
  async function handleToggleDone(activity: Activity) {
    try {
      setTogglingDone(true);
      const reponse = await toggleActivityDone(activity.id?.toString()!);
      queryClient.invalidateQueries(["activities"]);
      toast("Atividade marcada como concluída", "success");
    } catch (error) {
      console.log(error);
      toast("Erro ao marcar atividade como concluída", "error");
    } finally {
      setTogglingDone(false);
    }
  }

  const doneActivities = data?.data?.filter((activity) => activity.done);
  const pendingActivities = data?.data?.filter((activity) => !activity.done);

  return (
    <View className="h-full p-2">
      <Button
        text="Create Activity"
        onPress={() => {
          navigate("Activity");
        }}
      />
      <ScrollView className="p-2">
        <View className="my-2 w-full flex-row items-center">
          <Text className="text-lg font-semibold">Pending</Text>
          <View className="w-full h-[2px] bg-black ml-2 mt-1" />
        </View>
        {pendingActivities?.map((activity) => (
          <ActivityListItem
            key={activity.id}
            activity={activity}
            onPress={() => {
              navigate("Activity", { activityId: activity.id });
            }}
            onToggleDone={handleToggleDone}
          />
        ))}
        <View className="my-2 w-full flex-row items-center">
          <Text className="text-lg font-semibold">Done</Text>
          <View className="w-full h-[2px] bg-black ml-2 mt-1" />
        </View>
        {doneActivities?.map((activity) => (
          <ActivityListItem
            key={activity.id}
            activity={activity}
            onPress={() => {
              navigate("Activity", { activityId: activity.id });
            }}
            onToggleDone={handleToggleDone}
          />
        ))}
      </ScrollView>
    </View>
  );
}
