import { Fragment } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import colors from "tailwindcss/colors";
import { pallete } from "../styles/pallete";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "contained" | "text" | "outlined";
  color?: "primary" | "secondary" | "error";
  text?: string;
  loading?: boolean;
  style?: any;
}

export function Button({
  loading = false,
  variant = "contained",
  color = "primary",
  text = "",
  style = {},
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
        className: `rounded-md p-2 w-full items-center`,
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
        className: `rounded-md p-2 w-full items-center`,
        style: {
          backgroundColor: "transparent",
        },
      },
      text: {
        className: ``,
        style: {},
      },
    },
    outlined: {
      button: {
        className: `rounded-md p-2 w-full items-center`,
        style: {
          backgroundColor: "transparent",
          borderWidth: 1,
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
      style={{ ...variants[variant].button.style, ...style }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "contained" ? colors.white : pallete[color]}
        />
      ) : (
        <Fragment>
          {text ? (
            <Text
              className={variants[variant].text.className}
              style={variants[variant].text.style}
            >
              {text}
            </Text>
          ) : (
            rest.children
          )}
        </Fragment>
      )}
    </TouchableOpacity>
  );
}
