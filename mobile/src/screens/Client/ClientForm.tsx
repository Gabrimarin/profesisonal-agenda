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
} from "../../api/clients";
import { Button } from "../../components/Button";
import { TextField } from "../../components/inputs/TextField";
import { Client as ClientType } from "../../models/Client";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToast } from "../../components/Toast";
import { Picker } from "@react-native-picker/picker";
import { contactTypes } from "../../constants/contactTypes";
import { ContactTypePicker } from "../../components/inputs/ContactTypePicker";

export function ClientForm() {
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
  const { isInitialLoading } = useQuery({
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
    console.log("data", data);
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
  if (isInitialLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="p-2">
      <FormProvider {...formMethods}>
        <TextField
          control={control}
          name="name"
          label="Name"
          placeholder="Name"
        />
        {contacts.map((field, index) => {
          return (
            <View key={field.id}>
              <Text>
                {"Contact"} #{index + 1}
              </Text>
              <View key={field.id} className="flex-row gap-2">
                <View className="flex-[2.5]">
                  {/* <TextField
                  placeholder="Type"
                  name={`contacts.${index}.type`}
                  control={control}
                /> */}
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
                    name="trash"
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
        })}
      </FormProvider>
      <Button
        onPress={addContact}
        text="Add Contact"
        variant="outlined"
        style={{ marginTop: 10 }}
      />

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
          text="Update client"
        />
      ) : (
        <Button
          style={{ marginTop: 10 }}
          onPress={handleSubmit(onCreate)}
          text="Create Client"
        />
      )}
    </View>
  );
}
