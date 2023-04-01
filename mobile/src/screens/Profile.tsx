import { View } from "react-native";
import { Button } from "../components/Button";
import { useAppContext } from "../contexts/AppContext";
import { deleteValueFor } from "../lib/storage";

export function Profile() {
  const { setUser, user } = useAppContext();

  async function signOut() {
    setUser(null);
    deleteValueFor("token");
  }
  return (
    <View>
      <View className="mt-auto">
        <Button onPress={signOut} variant="outlined" text="SignOut" />
      </View>
    </View>
  );
}
