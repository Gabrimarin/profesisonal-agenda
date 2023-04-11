import { View } from "react-native";
import { Button } from "../../../components/Button";
import { useAppContext } from "../../../contexts/AppContext";
import { deleteValueFor } from "../../../lib/storage";
import { useNavigation } from "@react-navigation/native";

export function Profile() {
  const { setUser, user } = useAppContext();
  const { navigate } = useNavigation();
  async function signOut() {
    setUser(null);
    deleteValueFor("token");
  }
  return (
    <View className="h-full p-2">
      <Button
        text="Manage Activity Types"
        onPress={() => navigate("ActivityTypeHome")}
      />
      <View className="mt-auto">
        <Button onPress={signOut} variant="outlined" text="SignOut" />
      </View>
    </View>
  );
}
