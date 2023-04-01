import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Button } from "../components/Button";
import { TextField } from "../components/inputs/TextField";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToast } from "../components/Toast";
import { ActivityType as ActivityTypeType } from "../models/ActivityType";
import {
  createActivityType,
  deleteActivityType,
  getActivityType,
  updateActivityType,
} from "../api/activityTypes";

export function ActivityType() {
  const route = useRoute();
  const params: any = route.params;
  const activityTypeId = params?.activityTypeId;
  const isEditing = !!activityTypeId;
  const { toast } = useToast();
  const formMethods = useForm<ActivityTypeType>({
    defaultValues: {
      name: "",
    },
  });
  const { handleSubmit, setError, reset } = formMethods;
  const { isInitialLoading } = useQuery({
    queryKey: ["activityType", activityTypeId],
    queryFn: ({ queryKey: [, activityTypeId] }) =>
      getActivityType(activityTypeId!),
    enabled: isEditing,
    onSuccess: (data) => {
      reset(data.data);
    },
  });

  const { goBack } = useNavigation();
  const queryClient = useQueryClient();

  const handleSubmitError = (error: any) => {
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

  async function onCreate(data: ActivityTypeType) {
    console.log(data);
    createActivityType(data)
      .then(() => {
        queryClient.invalidateQueries(["activityTypes"]);
        goBack();
      })
      .catch(handleSubmitError);
  }

  async function onUpdate(data: ActivityTypeType) {
    updateActivityType(activityTypeId!, data)
      .then(() => {
        queryClient.invalidateQueries(["activityTypes"]);
        toast("Activity Type updated successfully", "success");
      })
      .catch(handleSubmitError);
  }
  async function onDelete() {
    try {
      await deleteActivityType(activityTypeId!);
      queryClient.invalidateQueries(["activityTypes"]);
      toast("Activity Type deleted successfully", "success");
      goBack();
    } catch (error) {
      console.log(error);
      toast("Error deleting activity type", "error");
    }
  }

  if (isInitialLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="p-2">
      <FormProvider {...formMethods}>
        <TextField name="name" label="Name" placeholder="Name" />
      </FormProvider>

      {isEditing && (
        <Button
          onPress={onDelete}
          text="Delete Activity Type"
          variant="outlined"
          style={{ marginTop: 10 }}
        />
      )}

      {isEditing ? (
        <Button
          style={{ marginTop: 10 }}
          onPress={handleSubmit(onUpdate)}
          text="Update Activity Type"
        />
      ) : (
        <Button
          style={{ marginTop: 10 }}
          onPress={handleSubmit(onCreate)}
          text="Create Activity Type"
        />
      )}
    </View>
  );
}
