import { Text, View, ViewProps } from "react-native";

interface InputWrapperProps extends ViewProps {
  label?: string;
  errorMessage?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export function InputWrapper({
  label = "",
  children,
  errorMessage,
  startAdornment,
  endAdornment,
  ...rest
}: InputWrapperProps) {
  return (
    <View className={`w-full`} {...rest}>
      {label && <Text className="text-primary">{label}</Text>}
      <View className="h-10 w-full justif items-center flex-row bg-white rounded-md p-2 placeholder:text-accent border-2 border-transparent focus:border-secondary">
        {startAdornment && <View className="mr-2">{startAdornment}</View>}
        {children}
        {endAdornment && <View className="ml-auto">{endAdornment}</View>}
      </View>
      {errorMessage && <Text className="text-error">{errorMessage}</Text>}
    </View>
  );
}
