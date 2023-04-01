import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import colors from "tailwindcss/colors";
import {
  createClient,
  deleteClient,
  getClient,
  updateClient,
} from "../api/clients";
import { Button } from "../components/Button";
import { TextField } from "../components/inputs/TextField";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToast } from "../components/Toast";
import { contactTypes } from "../constants/contactTypes";
import { Activity as ActivityType } from "../models/Activity";
import {
  createActivity,
  deleteActivity,
  getActivity,
  updateActivity,
} from "../api/activities";
import { DateTimePicker } from "../components/inputs/DateTimePicker";
import { Checkbox } from "../components/inputs/Checkbox";
import { ClientPicker } from "../components/inputs/ClientPicker";
import { ActivityTypePicker } from "../components/inputs/ActivityTypePicker";
import { Picker } from "../components/inputs/Picker";

export function Activity() {
  const route = useRoute();
  const params: any = route.params;
  const activityId = params?.activityId;
  const isEditing = !!activityId;
  const { toast } = useToast();
  const formMethods = useForm<ActivityType>({
    defaultValues: {
      name: "",
      activityTypeId: undefined,
      clientId: undefined,
      dateStart: new Date(),
      done: false,
      price: undefined,
      dateEnd: undefined,
    },
  });
  const { control, setValue, handleSubmit, watch, setError, reset } =
    formMethods;
  const { isInitialLoading } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: ({ queryKey: [, activityId] }) => getActivity(activityId!),
    enabled: isEditing,
    onSuccess: (data) => {
      console.log(data.data);
      reset(data.data);
    },
  });

  const { goBack } = useNavigation();
  const queryClient = useQueryClient();

  const handleSubmitError = (error: any) => {
    console.log(error);
    const { data } = error.response;
    const fieldErrors = data.fieldErrors;
    const message = data.message;
    if (message) {
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
  };

  async function onCreate(data: ActivityType) {
    await createActivity({
      ...data,
      price: data.price ? Number(data.price) : 0,
    })
      .then(() => {
        queryClient.invalidateQueries(["activities"]);
        goBack();
      })
      .catch(handleSubmitError);
  }

  async function onUpdate(data: ActivityType) {
    updateActivity(activityId!, {
      ...data,
      price: data.price ? Number(data.price) : 0,
    })
      .then(() => {
        queryClient.invalidateQueries(["activities"]);
        toast("Activity updated successfully", "success");
      })
      .catch(handleSubmitError);
  }
  async function onDelete() {
    try {
      await deleteActivity(activityId!);
      queryClient.invalidateQueries(["activities"]);
      toast("Activity deleted successfully", "success");
      goBack();
    } catch (error) {
      console.log(error);
      toast("Error deleting activity", "error");
    }
  }

  if (isInitialLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="p-2">
      <FormProvider {...formMethods}>
        <TextField name="name" label="Name" placeholder="Name" />
        <ClientPicker />
        <ActivityTypePicker name="activityTypeId" />
        <DateTimePicker name="dateStart" />
        <Checkbox name="done" label="Done" />
        <TextField name="price" label="Price" placeholder="Price" />
      </FormProvider>

      {isEditing && (
        <Button
          onPress={onDelete}
          text="Delete Contact"
          variant="outlined"
          style={{ marginTop: 10 }}
        />
      )}

      {isEditing ? (
        <Button
          style={{ marginTop: 10 }}
          onPress={handleSubmit(onUpdate)}
          text="Update Activity"
        />
      ) : (
        <Button
          style={{ marginTop: 10 }}
          onPress={handleSubmit(onCreate)}
          text="Create Activity"
        />
      )}
    </View>
  );
}
