import { Text, TextInput, TextInputProps, View } from "react-native";
import { Control, Controller, useFormContext } from "react-hook-form";
import { InputWrapper } from "./InputWrapper";

interface TextFieldProps extends TextInputProps {
  label?: string;
  name: string;
  control?: Control<any>;
}

export function TextField({
  label = "",
  style = {},
  name,
  control,
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
          <InputWrapper errorMessage={error?.message} label={label}>
            <TextInput
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
