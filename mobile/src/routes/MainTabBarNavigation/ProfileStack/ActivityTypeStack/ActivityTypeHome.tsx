import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { FAB } from "../../../../components/FAB";
import { TextField } from "../../../../components/inputs/TextField";
import { ResourceWrapper } from "../../../../components/ResourceWrapper";
import colors from "tailwindcss/colors";
import { ActivityTypeList } from "./components/ActivityTypeList";
import { getActivityTypes } from "../../../../api/activityTypes";

export function ActivityTypeHome() {
  const { navigate } = useNavigation();

  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: getActivityTypes,
  });

  const formMethods = useForm();
  const activityTypesList = data?.data || [];

  const filteredActivitiesList = activityTypesList.filter((activity) => {
    const search = formMethods.watch("search");
    return (
      !search || activity.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isEmpty = activityTypesList.length === 0;
  return (
    <ResourceWrapper loading={isFetching} error={error} onRetry={refetch}>
      <View className="p-2">
        {!isEmpty && (
          <FormProvider {...formMethods}>
            <TextField
              startAdornment={
                <Feather name="search" size={20} color={colors.gray[300]} />
              }
              name="search"
              label="Search"
              placeholder="Search for activities"
              eraser
            />
          </FormProvider>
        )}
        <View className="h-full">
          {isEmpty && (
            <View className="h-full items-center justify-center">
              <Text className="text-2xl text-primary">
                No activity type yet
              </Text>
            </View>
          )}
          <ActivityTypeList
            activityTypes={filteredActivitiesList}
            onSelectActivityType={(activityType) => {
              navigate("ActivityTypeForm", { activityTypeId: activityType.id });
            }}
          />
        </View>
      </View>
      <FAB
        icon={<Feather name="plus" size={24} color="white" />}
        onPress={() => navigate("ActivityTypeForm")}
      />
    </ResourceWrapper>
  );
}
