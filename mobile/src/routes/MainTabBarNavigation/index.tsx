import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text } from "react-native";
import { ClientHome } from "./ClientStack/ClientHome";
import { ActivityHome } from "./ActivityStack/ActivityHome";
import Charts from "../../screens/Charts";
import { ProfileStack } from "./ProfileStack";
import { useAppContext } from "../../contexts/AppContext";

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
  const { user } = useAppContext();
  const userImageUrl = user?.image_url;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Clients"
        component={ClientHome}
        options={tabBarOptions({ label: "Clients", icon: "users" })}
      />
      <Tab.Screen
        name="Activities"
        component={ActivityHome}
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
        options={{
          ...tabBarOptions({ label: "Profile", icon: "smile" }),
          ...(userImageUrl
            ? {
                tabBarIcon: ({ focused }: any) => {
                  return (
                    <Image
                      source={{ uri: userImageUrl }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: focused ? "black" : "gray",
                      }}
                    />
                  );
                },
              }
            : {}),
        }}
      />
    </Tab.Navigator>
  );
}
