import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TextField } from "../components/inputs/TextField";
import { save } from "../lib/storage";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "../components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { login } from "../api/auth";

type FormValues = {
  email: string;
  password: string;
};

export function Login() {
  const { navigate } = useNavigation();
  const { setUser } = useAppContext();
  const route = useRoute();
  const { email } = route.params;

  const { control, register, setValue, handleSubmit, setError } =
    useForm<FormValues>({
      defaultValues: {
        email,
      },
    });

  const { mutateAsync, isLoading } = useMutation((data: FormValues) => {
    return login(data);
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await mutateAsync(data);
      const token = response.data.token;
      save("token", token);
      setUser(response.data.user);
    } catch (error: any) {
      console.log(JSON.stringify(error));
      const { data } = error.response;
      const fieldErrors = data.fieldErrors;
      const message = data.message;
      if (message) {
        console.log(message);
      }
      if (fieldErrors) {
        fieldErrors.forEach((fieldError: any) => {
          setError(fieldError.field, {
            message: fieldError.message,
          });
        });
      }
      return;
    }
  }

  return (
    <View className="bg-light h-full items-center justify-center p-4">
      <Text className="text-primary text-3xl">Login</Text>
      <TextField
        name="email"
        label="Email"
        placeholder="Email"
        keyboardType="email-address"
        control={control}
      />
      <TextField
        name="password"
        label="Password"
        placeholder="Password"
        secureTextEntry
        control={control}
      />
      <Button
        style={{ marginTop: 20 }}
        text="Login"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
      />
      <Text className="text-secondry my-4">Don't have an account?</Text>
      <Button
        text="Sign Up"
        variant="outlined"
        onPress={() => navigate("Register")}
      />
    </View>
  );
}
