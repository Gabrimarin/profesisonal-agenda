import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "../screens/Login";
import { useAppContext } from "../contexts/AppContext";
import { Register } from "../screens/Register";
import { getValueFor } from "../lib/storage";
import { getUser } from "../api/auth";
import { ActivityIndicator } from "react-native";
import { pallete } from "../styles/pallete";
import { Header } from "../components/Header";
import { useMutation } from "@tanstack/react-query";
import { MainTabBarNavigation } from "./MainTabBarNavigation";

type RootStackParamList = {
  Login: {
    email?: string;
  };
  Register: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootRoute() {
  const { user, setUser } = useAppContext();
  const isSignedIn = user !== null;
  const { mutateAsync, isLoading } = useMutation(async () => {
    return getUser();
  });

  async function setCurrentUser() {
    try {
      const token = await getValueFor("token");
      if (!token) return;
      const response = await mutateAsync();
      const user = response.data;
      setUser(user);
    } catch (e) {}
  }

  useEffect(() => {
    setCurrentUser();
  }, []);

  if (isLoading) return <ActivityIndicator color={pallete.primary} />;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: Header,
          contentStyle: {},
        }}
      >
        {isSignedIn ? (
          <Stack.Screen
            name="Main"
            component={MainTabBarNavigation}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              initialParams={{
                email: "",
              }}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
