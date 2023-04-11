import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { FAB } from "../../../components/FAB";
import { TextField } from "../../../components/inputs/TextField";
import { ResourceWrapper } from "../../../components/ResourceWrapper";
import colors from "tailwindcss/colors";
import { getActivities, toggleActivityDone } from "../../../api/activities";
import { ActivityList } from "./components/ActivityList";
import { Activity } from "../../../models/Activity";
import { useToast } from "../../../components/Toast";

export function ActivityHome() {
  const { navigate } = useNavigation();
  const [togglingDone, setTogglingDone] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  async function handleToggleDone(activity: Activity) {
    try {
      setTogglingDone(true);
      await toggleActivityDone(activity.id?.toString()!);
      queryClient.invalidateQueries(["activities"]);
      toast("Atividade marcada como concluída", "success");
    } catch (error) {
      console.log(error);
      toast("Erro ao marcar atividade como concluída", "error");
    } finally {
      setTogglingDone(false);
    }
  }

  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const formMethods = useForm();
  const activitiesList = data?.data || [];

  const filteredActivitiesList = activitiesList.filter((activity) => {
    const search = formMethods.watch("search");
    return (
      !search || activity.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isEmpty = activitiesList.length === 0;
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
              <Text className="text-2xl text-primary">No activity yet</Text>
            </View>
          )}
          <ActivityList
            activities={filteredActivitiesList}
            onSelectActivity={(activity) => {
              navigate("ActivityForm", { activityId: activity.id });
            }}
            onToggleDone={handleToggleDone}
          />
        </View>
      </View>
      <FAB
        icon={<Feather name="plus" size={24} color="white" />}
        onPress={() => navigate("ActivityForm")}
      />
    </ResourceWrapper>
  );
}
