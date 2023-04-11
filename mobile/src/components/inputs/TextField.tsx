import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Control, Controller, useFormContext } from "react-hook-form";
import { InputWrapper } from "./InputWrapper";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

interface TextFieldProps extends TextInputProps {
  label?: string;
  name: string;
  control?: Control<any>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  eraser?: boolean;
}

export function TextField({
  label = "",
  style = {},
  name,
  control,
  startAdornment,
  endAdornment,
  eraser,
  ...rest
}: TextFieldProps) {
  const formMethods = useFormContext();
  const usedControl = control || formMethods.control;
  return (
    <Controller
      name={name}
      control={usedControl}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <InputWrapper
            errorMessage={error?.message}
            label={label}
            startAdornment={startAdornment}
            endAdornment={
              <View>
                {eraser && !!value && (
                  <TouchableOpacity
                    onPress={() => {
                      onChange("");
                    }}
                  >
                    <Feather name="x" size={20} color={colors.gray[300]} />
                  </TouchableOpacity>
                )}
                {endAdornment}
              </View>
            }
          >
            <TextInput
              className="flex-1"
              onChangeText={onChange}
              value={value ? value.toString() : ""}
              {...rest}
            />
          </InputWrapper>
        );
      }}
    />
  );
}
