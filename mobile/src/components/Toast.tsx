import Toast from "react-native-root-toast";

export function useToast() {
  const toast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info",
    duration: number = Toast.durations.LONG
  ) => {
    Toast.show(message, {
      duration,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: {
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
      }[severity],
    });
  };

  return { toast };
}
