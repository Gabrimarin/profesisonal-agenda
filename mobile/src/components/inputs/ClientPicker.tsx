import { Text, TouchableOpacity } from "react-native";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../api/clients";
import { Picker } from "./Picker";

export function ClientPicker() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
  const clientList = data?.data ?? [];
  return (
    <Picker
      label="Client"
      name="clientId"
      items={clientList}
      getValue={(item) => item.id}
      renderInputItem={(item) => <Text>{item.name}</Text>}
      renderModalItem={(item) => <Text>{item.name}</Text>}
    />
  );
}
