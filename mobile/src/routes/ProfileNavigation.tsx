import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { Profile } from "../screens/Profile";

type RootStackParamList = {
  ProfileHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function ProfileNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileHome"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
