import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { Activity } from "../screens/Activity";
import { ActivityList } from "../screens/ActivityList";
import { ActivityType } from "../screens/ActivityType";
import { ActivityTypeList } from "../screens/ActivityTypeList";
import { CalendarHome } from "../screens/Calendar/CalendarHome";
import Charts from "../screens/Charts";
import { ClientForm } from "../screens/Client/ClientForm";
import { ClientHome } from "../screens/Client/ClientHome";
import { Home } from "../screens/Home";

type RootStackParamList = {
  HomeRoot: undefined;
  ClientHome: undefined;
  ClientForm: {
    clientId?: string;
  };
  ActivityList: undefined;
  Activity: {
    activityId?: string;
  };
  ActivityTypeList: undefined;
  ActivityType: {
    activityTypeId?: string;
  };
  Charts: undefined;
  CalendarHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function HomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeRoot"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ClientHome" component={ClientHome} />
      <Stack.Screen name="ClientForm" component={ClientForm} />
      <Stack.Screen name="ActivityList" component={ActivityList} />
      <Stack.Screen name="Activity" component={Activity} />
      <Stack.Screen name="ActivityTypeList" component={ActivityTypeList} />
      <Stack.Screen name="ActivityType" component={ActivityType} />
      <Stack.Screen name="Charts" component={Charts} />
      <Stack.Screen name="CalendarHome" component={CalendarHome} />
    </Stack.Navigator>
  );
}
