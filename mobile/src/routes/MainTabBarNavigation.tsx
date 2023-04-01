import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { HomeNavigation } from "./HomeNavigation";
import { ProfileNavigation } from "./ProfileNavigation";

const Tab = createBottomTabNavigator();

export function MainTabBarNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={{ color: focused ? "black" : "gray" }}>Profile</Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                name="user"
                size={24}
                color={focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={{ color: focused ? "black" : "gray" }}>Home</Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Feather
                name="home"
                size={24}
                color={focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
