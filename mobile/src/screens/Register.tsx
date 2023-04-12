import React from "react";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TextField } from "../components/inputs/TextField";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { createUser } from "../api/user";
import { useToast } from "../components/Toast";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export function Register() {
  const { navigate } = useNavigation();
  const { control, setValue, handleSubmit, setError } = useForm<FormValues>();
  const { toast } = useToast();
  const { mutateAsync, isLoading } = useMutation((data: FormValues) => {
    return createUser(data);
  });

  async function onSubmit(data: FormValues) {
    try {
      await mutateAsync(data);
      toast("User created successfully", "success");
      navigate("Login", { email: data.email });
    } catch (error: any) {
      const { data } = error.response;
      const fieldErrors = data.fieldErrors;
      const message = data.message;
      if (message) {
        console.log(message);
        toast(message, "error");
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
      <Text className="text-primary text-3xl">Register</Text>
      <TextField
        label="Name"
        placeholder="Name"
        name="name"
        control={control}
      />
      <TextField
        label="Email"
        placeholder="Email"
        keyboardType="email-address"
        control={control}
        name="email"
      />
      <TextField
        label="Password"
        placeholder="Password"
        secureTextEntry
        control={control}
        name="password"
      />
      <Button
        style={{ marginTop: 20 }}
        loading={isLoading}
        text="Register"
        onPress={handleSubmit(onSubmit)}
      />
      <Text className="text-secondry my-4">Have an account?</Text>
      <Button
        text="Login"
        variant="outlined"
        onPress={() => navigate("Login")}
      />
    </View>
  );
}
