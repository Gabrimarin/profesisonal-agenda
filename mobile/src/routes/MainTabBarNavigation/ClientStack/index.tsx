import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClientHome } from "./ClientHome";
import { ClientForm } from "./ClientForm";

type ClientStackParamList = {
  ClientHome: undefined;
  ClientForm: {
    clientId?: number;
  };
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

export function ClientStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientHome"
        component={ClientHome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ClientForm" component={ClientForm} />
    </Stack.Navigator>
  );
}
