import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FlatList, ScrollView, Text, View } from "react-native";
import colors from "tailwindcss/colors";
import {
  createClient,
  deleteClient,
  getClient,
  updateClient,
} from "../../../api/clients";
import { Button } from "../../../components/Button";
import { TextField } from "../../../components/inputs/TextField";
import { Client as ClientType } from "../../../models/Client";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToast } from "../../../components/Toast";
import { ContactTypePicker } from "../../../components/inputs/ContactTypePicker";
import { ResourceWrapper } from "../../../components/ResourceWrapper";

export function ClientForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const params: any = route.params;
  const clientId = params?.clientId;
  const isEditing = !!clientId;
  const { toast } = useToast();
  const formMethods = useForm<ClientType>({
    defaultValues: {
      name: "",
      contacts: [],
    },
  });
  const { control, setValue, handleSubmit, watch, setError, reset } =
    formMethods;
  const { isFetching } = useQuery({
    queryKey: ["client", clientId],
    queryFn: ({ queryKey: [, clientId] }) => getClient(clientId!),
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

  async function onCreate(data: ClientType) {
    createClient({
      ...data,
      contacts: data.contacts.map((contact) => ({
        ...contact,
        id: undefined,
      })),
    })
      .then(() => {
        queryClient.invalidateQueries(["clients"]);
        goBack();
      })
      .catch(handleSubmitError);
  }

  async function onUpdate(data: ClientType) {
    updateClient(clientId!, data)
      .then(() => {
        queryClient.invalidateQueries(["clients"]);
        toast("Client updated successfully", "success");
      })
      .catch(handleSubmitError);
  }
  async function onDelete() {
    try {
      await deleteClient(clientId!);
      queryClient.invalidateQueries(["clients"]);
      toast("Client deleted successfully", "success");
      goBack();
    } catch (error) {
      console.log(error);
      toast("Error deleting client", "error");
    }
  }

  const contacts = watch("contacts");

  function removeContact(index: number) {
    setValue("contacts", [
      ...contacts.slice(0, index),
      ...contacts.slice(index + 1),
    ]);
  }

  function addContact() {
    setValue("contacts", [
      ...contacts,
      {
        id: Math.random().toString(),
        type: "phone",
        value: "",
      },
    ]);
  }

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Client" : "Create Client",
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
    <ScrollView nestedScrollEnabled>
      <ResourceWrapper loading={isFetching} error={null}>
        <FormProvider {...formMethods}>
          <TextField
            control={control}
            name="name"
            label="Name"
            placeholder="Name"
          />
          <Text className="text-lg mt-2 font-bold">
            {!!contacts.length ? "Contacts" : "No contacts"}
          </Text>
          {!!contacts.length && (
            <View className="max-h-72">
              <FlatList
                nestedScrollEnabled
                data={contacts}
                renderItem={({ item, index }) => {
                  return (
                    <View key={item.id} className="bg-red">
                      <Text>
                        {"Contact"} #{index + 1}
                      </Text>
                      <View key={item.id} className="flex-row gap-2">
                        <View className="flex-[3]">
                          <ContactTypePicker name={`contacts.${index}.type`} />
                        </View>
                        <View className="flex-[5]">
                          <TextField
                            name={`contacts.${index}.value`}
                            placeholder="Value"
                            control={control}
                          />
                        </View>
                        <View className="flex-1 items-center justify-center">
                          <Feather.Button
                            onPress={() => {
                              removeContact(index);
                            }}
                            name="x"
                            size={24}
                            backgroundColor="transparent"
                            underlayColor={colors.red["100"]}
                            color={colors.red["500"]}
                            iconStyle={{ marginRight: 0 }}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </FormProvider>
        <View className="ml-auto">
          <Button
            startIcon={<Feather name="plus" size={20} color="black" />}
            onPress={addContact}
            text="Add Contact"
            variant="text"
            style={{ marginTop: 10 }}
          />
        </View>

        <View className="mt-auto">
          {isEditing ? (
            <Button
              startIcon={<Feather name="check" size={20} color="white" />}
              style={{ marginTop: 10 }}
              onPress={handleSubmit(onUpdate)}
              text="Update client"
            />
          ) : (
            <Button
              startIcon={<Feather name="check" size={20} color="white" />}
              style={{ marginTop: 10 }}
              onPress={handleSubmit(onCreate)}
              text="Create Client"
            />
          )}
        </View>
      </ResourceWrapper>
    </ScrollView>
  );
}
