import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import colors from "tailwindcss/colors";
import { Button } from "../../../../components/Button";
import { TextField } from "../../../../components/inputs/TextField";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToast } from "../../../../components/Toast";
import { ResourceWrapper } from "../../../../components/ResourceWrapper";
import { ActivityType } from "../../../../models/ActivityType";
import {
  createActivityType,
  deleteActivityType,
  getActivityType,
  updateActivityType,
} from "../../../../api/activityTypes";

export function ActivityTypeForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const params: any = route.params;
  const activityTypeId = params?.activityTypeId;
  const isEditing = !!activityTypeId;
  const { toast } = useToast();
  const formMethods = useForm<ActivityType>({
    defaultValues: {
      name: "",
    },
  });
  const { handleSubmit, setError, reset } = formMethods;
  const { isFetching } = useQuery({
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

  async function onCreate(data: ActivityType) {
    createActivityType(data)
      .then(() => {
        queryClient.invalidateQueries(["activityTypes"]);
        goBack();
      })
      .catch(handleSubmitError);
  }

  async function onUpdate(data: ActivityType) {
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
      toast("Error deleting Activity Type", "error");
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Activity Type" : "Create Activity Type",
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
        </FormProvider>

        <View className="mt-auto">
          {isEditing ? (
            <Button
              startIcon={<Feather name="check" size={20} color="white" />}
              style={{ marginTop: 10 }}
              onPress={handleSubmit(onUpdate)}
              text="Update Activity Type"
            />
          ) : (
            <Button
              startIcon={<Feather name="check" size={20} color="white" />}
              style={{ marginTop: 10 }}
              onPress={handleSubmit(onCreate)}
              text="Create Activity Type"
            />
          )}
        </View>
      </ResourceWrapper>
    </View>
  );
}
