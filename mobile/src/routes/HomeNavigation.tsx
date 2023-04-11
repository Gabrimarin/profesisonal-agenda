import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Charts from "../screens/Charts";
import { Home } from "../screens/Home";

type RootStackParamList = {
  HomeRoot: undefined;
  Charts: undefined;
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
      <Stack.Screen name="Charts" component={Charts} />
    </Stack.Navigator>
  );
}
