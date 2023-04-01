import { Text, TouchableOpacity, View } from "react-native";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getClientContactTypes, getClients } from "../../api/clients";
import { Picker } from "./Picker";
import { Feather } from "@expo/vector-icons";
import clsx from "clsx";

export const ContactTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "email":
      return <Feather name="mail" size={20} color="black" />;
    case "phone":
      return <Feather name="phone" size={20} color="black" />;
    case "other":
      return <Feather name="message-circle" size={20} color="black" />;
    default:
      return <Feather name="message-circle" size={20} color="black" />;
  }
};

export function ContactTypePicker({ name }: { name: string }) {
  const { data } = useQuery({
    queryKey: ["contact_types"],
    queryFn: getClientContactTypes,
    cacheTime: 1000 * 60 * 60 * 24,
  });
  const contactTypesList = data?.data ?? [];

  return (
    <Picker
      name={name}
      items={contactTypesList}
      getValue={(item) => item}
      renderModalItem={(item) => (
        <View className="flex-row items-center p-2">
          <ContactTypeIcon type={item} />
          <Text className="ml-2 mb-0.5 text-xl">{item}</Text>
        </View>
      )}
      renderInputItem={(item) => {
        return (
          <View className="flex-row items-center">
            <ContactTypeIcon type={item} />
            <Text className="ml-2 text-base">{item}</Text>
          </View>
        );
      }}
    />
  );
}
