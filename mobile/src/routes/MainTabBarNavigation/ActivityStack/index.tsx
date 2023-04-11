import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityHome } from "./ActivityHome";
import { ActivityForm } from "./ActivityForm";

type ActivityStackParamList = {
  ActivityHome: undefined;
  ActivityForm: {
    activityId?: number;
  };
};

const Stack = createNativeStackNavigator<ActivityStackParamList>();

export function ActivityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ActivityHome"
        component={ActivityHome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ActivityForm" component={ActivityForm} />
    </Stack.Navigator>
  );
}
