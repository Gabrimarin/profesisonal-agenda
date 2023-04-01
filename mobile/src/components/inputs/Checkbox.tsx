import clsx from "clsx";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Control, Controller, useFormContext } from "react-hook-form";

interface UncontrolledCheckboxProps extends TouchableOpacityProps {
  checked?: boolean;
  label?: string;
}

interface CheckboxProps extends UncontrolledCheckboxProps {
  name: string;
  control?: Control<any>;
}

export function UncontrolledCheckbox({
  checked = false,
  label,
  onPress,
  ...rest
}: UncontrolledCheckboxProps) {
  return (
    <TouchableOpacity
      className="flex-row justify-between p-2"
      onPress={onPress}
      {...rest}
    >
      {label && <Text>{label}</Text>}

      <View
        className={clsx("w-6 h-6 rounded-md border-2 border-primary", {
          "bg-primary": checked,
        })}
      >
        {checked && <Feather name="check" size={20} color="white" />}
      </View>
    </TouchableOpacity>
  );
}

export function Checkbox({
  checked = false,
  label = "",
  name,
  control,
  ...rest
}: CheckboxProps) {
  const formMethods = useFormContext();
  const usedControl = control || formMethods.control;
  return (
    <Controller
      name={name}
      control={usedControl}
      render={({ field: { onChange, value: checked } }) => {
        return (
          <UncontrolledCheckbox
            checked={checked}
            label={label}
            onPress={() => onChange(!checked)}
            {...rest}
          />
        );
      }}
    />
  );
}
