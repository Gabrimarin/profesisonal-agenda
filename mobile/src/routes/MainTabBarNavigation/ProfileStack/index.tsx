import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Profile } from "./Profile";
import { ActivityTypeHome } from "./ActivityTypeStack/ActivityTypeHome";
import { ActivityTypeForm } from "./ActivityTypeStack/ActivityTypeForm";

type RootStackParamList = {
  ProfileHome: undefined;
  ActivityType: undefined;
  ActivityTypeHome: undefined;
  ActivityTypeForm: {
    activityTypeId?: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileHome"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ActivityTypeHome" component={ActivityTypeHome} />
      <Stack.Screen name="ActivityTypeForm" component={ActivityTypeForm} />
    </Stack.Navigator>
  );
}
