import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getActivities } from "../api/activities";
import { Button } from "../components/Button";
import { useAppContext } from "../contexts/AppContext";
import { Calendar } from "./Calendar/components/Calendar";

function NavButton({
  text,
  onPress,
  icon,
}: {
  text: string;
  onPress: () => void;
  icon: any;
}) {
  return (
    <TouchableOpacity
      className="flex-1 items-center justify-center border-2 py-4 rounded-md bg-white"
      onPress={onPress}
    >
      <Feather name={icon} size={24} color="black" />
      <Text className="text-base text-primary">{text}</Text>
    </TouchableOpacity>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View className="mt-2 w-full flex-row">{children}</View>;
}

export function Home() {
  const { user } = useAppContext();
  const { navigate } = useNavigation();

  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
  const activities = data?.data ?? [];

  return (
    <View className="p-2 h-full">
      <View className="flex-row justify-between items-center">
        <Text className="text-primary text-4xl">{user.name}</Text>
      </View>

      <Text className="text-xl text-primary">
        {dayjs().format("MMMM")} progress
      </Text>
      <Calendar
        activities={activities}
        month={dayjs().month()}
        year={dayjs().year()}
      />
      <View className="my-2" />
      <Button
        text="Calendar"
        onPress={() => {
          navigate("CalendarHome");
        }}
      />
      <View className="mt-2 flex-wrap w-full">
        <Row>
          <NavButton
            text="Clients"
            onPress={() => navigate("ClientHome")}
            icon="users"
          />
          <View className="w-2" />
          <NavButton
            text="Activities"
            onPress={() => navigate("ActivityList")}
            icon="activity"
          />
        </Row>
        <Row>
          <NavButton
            text="Activity Types"
            onPress={() => navigate("ActivityTypeList")}
            icon="list"
          />
          <View className="w-2" />
          <NavButton
            text="Charts"
            onPress={() => navigate("Charts")}
            icon="bar-chart"
          />
        </Row>
      </View>
    </View>
  );
}
