import { render, screen, fireEvent } from "@testing-library/react-native";
import { FieldError } from "react-hook-form";
import { TextField } from "./TextField";
import "@testing-library/jest-native/extend-expect";
import colors from "tailwindcss/colors";

test("render label correctly", () => {
  render(<TextField label="Email" />);
  const emailInput = screen.getByText("Email");
  expect(emailInput).toBeTruthy();
});

test("render error correctly", () => {
  render(<TextField error={{ message: "Email is required" } as FieldError} />);
  const emailInput = screen.getByText("Email is required");
  expect(emailInput).toBeTruthy();
  expect(emailInput).toHaveStyle({ color: colors.red[500] });
});
