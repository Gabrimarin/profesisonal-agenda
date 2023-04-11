import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import Charts from "../screens/Charts";
import { ActivityStack } from "./MainTabBarNavigation/ActivityStack";
import { ClientStack } from "./MainTabBarNavigation/ClientStack";
import { ProfileStack } from "./MainTabBarNavigation/ProfileStack";

const Tab = createBottomTabNavigator();

function tabBarOptions({ label, icon }: { label: string; icon: any }) {
  return {
    tabBarLabel: ({ focused }: any) => {
      return <Text style={{ color: focused ? "black" : "gray" }}>{label}</Text>;
    },
    tabBarIcon: ({ focused }: any) => {
      return (
        <Feather name={icon} size={24} color={focused ? "black" : "gray"} />
      );
    },
  };
}

export function MainTabBarNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={tabBarOptions({ label: "Home", icon: "home" })}
      /> */}
      <Tab.Screen
        name="Clients"
        component={ClientStack}
        options={tabBarOptions({ label: "Clients", icon: "users" })}
      />
      <Tab.Screen
        name="Activities"
        component={ActivityStack}
        options={tabBarOptions({ label: "Activities", icon: "calendar" })}
      />
      <Tab.Screen
        name="Charts"
        component={Charts}
        options={tabBarOptions({ label: "Charts", icon: "bar-chart" })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={tabBarOptions({ label: "Profile", icon: "smile" })}
      />
    </Tab.Navigator>
  );
}
