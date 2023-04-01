import dayjs from "dayjs";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Picker } from "../../components/inputs/Picker";
import { Calendar } from "./components/Calendar";

export function CalendarHome() {
  const formMethods = useForm({
    defaultValues: {
      month: dayjs().month(),
      year: dayjs().year(),
    },
  });

  const month = formMethods.watch("month");
  const year = formMethods.watch("year");

  return (
    <View className="p-2">
      <FormProvider {...formMethods}>
        <Picker
          items={Array.from({ length: 12 }).map((_, i) => ({
            label: dayjs().month(i).format("MMMM"),
            value: i,
          }))}
          getValue={(item) => item.value}
          name="month"
          renderInputItem={(item) => <Text>{item.label}</Text>}
        />
        <Picker
          items={Array.from({ length: 10 }).map((_, i) => ({
            label: dayjs()
              .year(dayjs().year() + i)
              .format("YYYY"),
            value: dayjs()
              .year(dayjs().year() + i)
              .year(),
          }))}
          getValue={(item) => item.value}
          name="year"
          renderInputItem={(item) => <Text>{item.label}</Text>}
        />
      </FormProvider>
      <Calendar activities={[]} month={month} year={year} />
    </View>
  );
}
