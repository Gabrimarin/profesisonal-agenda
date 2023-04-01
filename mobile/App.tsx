import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppContextProvider } from "./src/contexts/AppContext";
import RootRoute from "./src/routes/Root";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();
export default function App() {
  const [user, setUser] = useState(null);
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider
        value={{
          user,
          setUser,
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor={"transparent"} />
        <SafeAreaProvider>
          <RootRoute />
        </SafeAreaProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
}
