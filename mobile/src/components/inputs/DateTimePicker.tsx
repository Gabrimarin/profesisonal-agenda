import React from "react";
import { Control, Controller, useFormContext } from "react-hook-form";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Text, TouchableOpacity, View } from "react-native";
import { InputWrapper } from "./InputWrapper";
import dayjs from "dayjs";

const RenderDateTimePicker = ({
  date,
  onChange,
}: {
  date: Date;
  onChange: any;
}) => {
  const showDateTimePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };
  return (
    <TouchableOpacity onPress={showDateTimePicker}>
      <InputWrapper label="Start">
        <Text className="text-primary">{dayjs(date).format("DD/MM/YYYY")}</Text>
      </InputWrapper>
    </TouchableOpacity>
  );
};

export function DateTimePicker({
  name,
  control,
}: {
  name: string;
  control?: Control;
}) {
  const formMethods = useFormContext();
  const usedControl = control || formMethods.control;
  return (
    <Controller
      name={name}
      control={usedControl}
      render={({ field: { onChange, value } }) => {
        return (
          <RenderDateTimePicker
            date={value ? new Date(value) : new Date()}
            onChange={(e: DateTimePickerEvent, date?: Date) => onChange(date)}
          />
        );
      }}
    />
  );
}
