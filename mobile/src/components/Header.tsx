import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { HeaderBackButton, HeaderTitle } from "@react-navigation/elements";
import React from "react";
import { View } from "react-native";
import { pallete } from "../styles/pallete";

export function Header({
  back,
  navigation,
  options,
  route,
}: NativeStackHeaderProps) {
  return (
    <View className="bg-transparent h-16 items-center flex-row pl-2">
      {back && (
        <HeaderBackButton
          onPress={navigation.goBack}
          canGoBack={navigation.canGoBack()}
          labelVisible={false}
          tintColor={pallete.primary}
        />
      )}
      <HeaderTitle
        style={{
          color: pallete.primary,
        }}
      >
        {options.title || route.name}
      </HeaderTitle>
    </View>
  );
}
