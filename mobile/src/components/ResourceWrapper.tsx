import { ActivityIndicator, Text, View } from "react-native";
import { pallete } from "../styles/pallete";
import { Button } from "./Button";

export function ResourceWrapper({
  children,
  loading,
  error,
  onRetry,
}: {
  children: React.ReactNode;
  loading: boolean;
  error: any;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator color={pallete.primary} size={50} />
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View className="h-full items-center justify-center">
        <Text>{error.message}</Text>
        <Button text="Retry" onPress={onRetry} />
      </View>
    );
  }
  return <View className="h-full">{children}</View>;
}
