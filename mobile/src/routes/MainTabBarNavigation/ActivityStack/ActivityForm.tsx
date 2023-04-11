import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import colors from "tailwindcss/colors";
import { Button } from "../../../components/Button";
import { TextField } from "../../../components/inputs/TextField";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToast } from "../../../components/Toast";
import { ResourceWrapper } from "../../../components/ResourceWrapper";
import { Activity } from "../../../models/Activity";
import {
  createActivity,
  deleteActivity,
  getActivity,
  updateActivity,
} from "../../../api/activities";
import { ClientPicker } from "../../../components/inputs/ClientPicker";
import { ActivityTypePicker } from "../../../components/inputs/ActivityTypePicker";
import { DateTimePicker } from "../../../components/inputs/DateTimePicker";
import { Checkbox } from "../../../components/inputs/Checkbox";

export function ActivityForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const params: any = route.params;
  const activityId = params?.activityId;
  const isEditing = !!activityId;
  const { toast } = useToast();
  const formMethods = useForm<Activity>({
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
  const { handleSubmit, setError, reset } = formMethods;
  const { isFetching } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: ({ queryKey: [, activityId] }) => getActivity(activityId!),
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

  async function onCreate(data: Activity) {
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

  async function onUpdate(data: Activity) {
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

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Activity" : "Create Activity",
      headerRight: isEditing
        ? () => (
            <Feather.Button
              name="trash"
              size={24}
              color={colors.black}
              backgroundColor="transparent"
              underlayColor={colors.gray[100]}
              iconStyle={{ marginRight: 0 }}
              onPress={onDelete}
            />
          )
        : null,
    });
  }, [navigation]);

  return (
    <View className="p-2 h-full">
      <ResourceWrapper loading={isFetching} error={null}>
        <FormProvider {...formMethods}>
          <TextField name="name" label="Name" placeholder="Name" />
          <ClientPicker />
          <ActivityTypePicker name="activityTypeId" />
          <DateTimePicker name="dateStart" />
          <Checkbox name="done" label="Done" />
          <TextField name="price" label="Price" placeholder="Price" />
        </FormProvider>

        <View className="mt-auto">
          {isEditing ? (
            <Button
              startIcon={<Feather name="check" size={20} color="white" />}
              style={{ marginTop: 10 }}
              onPress={handleSubmit(onUpdate)}
              text="Update Activity"
            />
          ) : (
            <Button
              startIcon={<Feather name="check" size={20} color="white" />}
              style={{ marginTop: 10 }}
              onPress={handleSubmit(onCreate)}
              text="Create Activity"
            />
          )}
        </View>
      </ResourceWrapper>
    </View>
  );
}
