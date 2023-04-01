import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { getClients } from "../../api/clients";
import { FAB } from "../../components/FAB";
import { TextField } from "../../components/inputs/TextField";
import { ResourceWrapper } from "../../components/ResourceWrapper";
import { ClientList } from "./components/ClientList";

export function ClientHome() {
  const { navigate } = useNavigation();
  const { data, isFetched, isFetching, refetch, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
  const formMethods = useForm();
  const clientList = data?.data || [];
  const filteredClientList = clientList.filter((client) => client.active);
  const isEmpty = clientList.length === 0;
  return (
    <ResourceWrapper loading={isFetching} error={error} onRetry={refetch}>
      <View className="p-2">
        {!isEmpty && (
          <FormProvider {...formMethods}>
            <TextField name="search" label="Search" />
          </FormProvider>
        )}
        <View className="h-full">
          {isEmpty && (
            <View className="h-full items-center justify-center">
              <Text className="text-2xl text-primary">No clients yet</Text>
            </View>
          )}
          <ClientList
            clients={clientList}
            onSelectClient={(client) => {
              navigate("ClientForm", { clientId: client.id });
            }}
          />
        </View>
      </View>
      <FAB
        icon={<Feather name="plus" size={24} color="white" />}
        onPress={() => navigate("ClientForm")}
      />
    </ResourceWrapper>
  );
}
