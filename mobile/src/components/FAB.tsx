import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface FABProps extends TouchableOpacityProps {
  icon: React.ReactNode;
}

export function FAB({ icon, ...rest }: FABProps) {
  return (
    <TouchableOpacity
      className="rounded-full h-16 w-16 bg-primary items-center justify-center absolute right-4 bottom-4 shadow-lg"
      {...rest}
    >
      {icon}
    </TouchableOpacity>
  );
}
