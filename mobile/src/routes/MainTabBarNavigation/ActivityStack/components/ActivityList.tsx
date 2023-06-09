import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import {
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Activity } from "../../../../models/Activity";
import { UncontrolledCheckbox } from "../../../../components/inputs/Checkbox";

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

type Props = {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onToggleDone: (activity: Activity) => void;
};

export function ActivityList({
  activities,
  onSelectActivity,
  onToggleDone,
}: Props) {
  const doneActivities = activities.filter((activity) => activity.done);
  const pendingActivities = activities.filter((activity) => !activity.done);
  const data = [
    {
      title: "Pending",
      data: pendingActivities,
    },
    {
      title: "Done",
      data: doneActivities,
    },
  ];
  return (
    <View>
      <SectionList
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 80 }}
        sections={data}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <ActivityListItem
            activity={item}
            onPress={() => onSelectActivity(item)}
            onToggleDone={onToggleDone}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className="my-2 w-full flex-row items-center">
            <Text className="text-lg font-semibold">{title}</Text>
            <View className="w-full h-[2px] bg-black ml-2 mt-1" />
          </View>
        )}
      />
    </View>
  );
}
