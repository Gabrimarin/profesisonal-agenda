import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { getActivityTypes } from "../api/activityTypes";
import { Button } from "../components/Button";
import { ActivityType } from "../models/ActivityType";

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

export function ActivityTypeList() {
  const { navigate } = useNavigation();
  const { isLoading, error, data } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: getActivityTypes,
  });

  return (
    <View className="p-2 h-full">
      <Button
        text="Create Activity Type"
        onPress={() => {
          navigate("ActivityType");
        }}
      />
      <ScrollView>
        {data?.data?.map((activityType) => (
          <ActivityTypeListItem
            key={activityType.id}
            activityType={activityType}
            onPress={() => {
              navigate("ActivityType", { activityTypeId: activityType.id });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
