import { TouchableOpacityProps } from "react-native";
import { Control, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getActivityTypes } from "../../api/activityTypes";
import { Text } from "react-native";
import { Picker } from "./Picker";

interface Props extends TouchableOpacityProps {
  name: string;
  control?: Control<any>;
}

export function ActivityTypePicker({ name, control }: Props) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: getActivityTypes,
  });
  const formMethods = useFormContext();
  const usedControl = control || formMethods.control;
  const activityTypeList = data?.data ?? [];
  return (
    <Picker
      label="Activity Type"
      name={name}
      items={activityTypeList}
      getValue={(item) => item.id}
      renderInputItem={(item) => <Text>{item.name}</Text>}
      renderModalItem={(item) => <Text className="p-2">{item.name}</Text>}
    />
  );
}
