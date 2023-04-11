import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import colors from "tailwindcss/colors";
import { contactTypes } from "../../../../constants/contactTypes";
import { Client } from "../../../../models/Client";

interface ClientListItemProps extends TouchableOpacityProps {
  client: Client;
}

function Avatar() {
  return (
    <View className="w-8 h-8 rounded-full bg-gray-200 flex-row justify-center items-center">
      <Feather name="user" size={24} color="black" />
    </View>
  );
}

function ClientListItem({ client, ...rest }: ClientListItemProps) {
  const [contactsVisible, setContactsVisible] = useState(false);
  function toggleContactsVisible() {
    setContactsVisible((prev) => !prev);
  }
  const { name, contacts } = client;
  return (
    <TouchableOpacity
      className="p-2 my-2 border-2 rounded-lg bg-white"
      {...rest}
    >
      <View className="flex-row justify-between items-center h-8">
        <View className="flex-row">
          <Avatar />
          <Text className="text-lg font-semibold ml-2">{name}</Text>
        </View>
        <View className="flex-row items-center">
          {!contactsVisible && !!contacts?.length && (
            <View className="flex-row " key={client.id}>
              {[...new Set(contacts.map((contact) => contact.type))]
                .sort((a: any, b: any) => a - b)
                .map((contactType) => (
                  <Feather
                    key={contactType}
                    name={
                      contactTypes[contactType as keyof typeof contactTypes]
                        .icon as any
                    }
                    size={16}
                    color={colors.gray[600]}
                    style={{ marginRight: 4, marginLeft: 4 }}
                  />
                ))}
            </View>
          )}
          {!!contacts?.length && (
            <Feather.Button
              name={contactsVisible ? "chevron-up" : "chevron-down"}
              backgroundColor="transparent"
              underlayColor={colors.gray[100]}
              selectionColor={colors.gray[100]}
              iconStyle={{ marginRight: 0 }}
              color={colors.gray[600]}
              onPress={toggleContactsVisible}
            />
          )}
        </View>
      </View>
      {contactsVisible &&
        client?.contacts?.map((contact) => (
          <View className="flex-row items-center mt-2" key={contact.id}>
            <Feather
              name={
                contactTypes[contact.type as keyof typeof contactTypes]
                  .icon as any
              }
              size={16}
              color={colors.gray[600]}
              style={{ marginRight: 4 }}
            />
            <Text key={contact.id}>{contact.value}</Text>
          </View>
        ))}
    </TouchableOpacity>
  );
}

export function ClientList({
  clients,
  onSelectClient,
}: {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}) {
  return (
    <ScrollView>
      {clients.map((client) => (
        <ClientListItem
          key={client.id}
          client={client}
          onPress={() => onSelectClient(client)}
        />
      ))}
    </ScrollView>
  );
}
