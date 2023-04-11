import { Fragment } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { pallete } from "../styles/pallete";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "contained" | "text" | "outlined";
  color?: "primary" | "secondary" | "error";
  text?: string;
  loading?: boolean;
  style?: any;
  startIcon?: React.ReactNode;
}

export function Button({
  loading = false,
  variant = "contained",
  color = "primary",
  text = "",
  style = {},
  startIcon,
  ...rest
}: ButtonProps) {
  const variants: {
    [key: string]: {
      [key: string]: {
        className: string;
        style: any;
      };
    };
  } = {
    contained: {
      button: {
        className: `rounded-md p-2 items-center`,
        style: {
          backgroundColor: pallete[color],
        },
      },
      text: {
        className: `text-white`,
        style: {},
      },
    },
    text: {
      button: {
        className: `rounded-md p-2 items-center`,
        style: {
          backgroundColor: "transparent",
        },
      },
      text: {
        className: `font-bold`,
        style: {},
      },
    },
    outlined: {
      button: {
        className: `rounded-md p-2 items-center border`,
        style: {
          backgroundColor: "white",
          borderColor: pallete[color],
        },
      },
      text: {
        className: ``,
        style: {
          color: pallete[color],
        },
      },
    },
  };
  return (
    <TouchableOpacity
      className={variants[variant].button.className}
      activeOpacity={0.7}
      disabled={loading}
      style={{
        ...variants[variant].button.style,
        width: "100%",
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "contained" ? colors.white : pallete[color]}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {startIcon && <View className="ml-auto mr-2">{startIcon}</View>}
          {text ? (
            <Text
              className={variants[variant].text.className}
              style={variants[variant].text.style}
            >
              {text.toUpperCase()}
            </Text>
          ) : (
            rest.children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
