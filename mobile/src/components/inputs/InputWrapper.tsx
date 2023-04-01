import { Text, View, ViewProps } from "react-native";

interface InputWrapperProps extends ViewProps {
  label?: string;
  errorMessage?: string;
}

export function InputWrapper({
  label = "",
  children,
  errorMessage,
  ...rest
}: InputWrapperProps) {
  return (
    <View className={`w-full`} {...rest}>
      {label && <Text className="text-primary">{label}</Text>}
      <View className="h-10 w-full bg-white rounded-md p-2 placeholder:text-accent border-2 border-transparent focus:border-secondary">
        {children}
      </View>
      {errorMessage && <Text className="text-error">{errorMessage}</Text>}
    </View>
  );
}
