import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ActivityType } from "../../../../../models/ActivityType";

interface ActivityTypeListItemProps extends TouchableOpacityProps {
  activityType: ActivityType;
}

function ActivityTypeListItem({
  activityType,
  ...rest
}: ActivityTypeListItemProps) {
  const { name } = activityType;
  return (
    <TouchableOpacity
      className="p-2 my-2 border-2 rounded-lg bg-white"
      {...rest}
    >
      <Text className="text-lg font-semibold">{name}</Text>
    </TouchableOpacity>
  );
}
export function ActivityTypeList({
  activityTypes,
  onSelectActivityType,
}: {
  activityTypes: ActivityType[];
  onSelectActivityType: (activityType: ActivityType) => void;
}) {
  return (
    <ScrollView>
      {activityTypes.map((activityType) => (
        <ActivityTypeListItem
          key={activityType.id}
          activityType={activityType}
          onPress={() => onSelectActivityType(activityType)}
        />
      ))}
    </ScrollView>
  );
}
