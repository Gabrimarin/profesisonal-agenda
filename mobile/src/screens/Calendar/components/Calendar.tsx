import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import { Text, View } from "react-native";
import { Activity } from "../../../models/Activity";

export function Calendar({
  activities,
  month,
  year,
}: {
  activities: Activity[];
  month: number;
  year: number;
}) {
  const usedDate = dayjs(`${year}-${month + 1}-01`);
  const numDaysOfCurrentMonth = usedDate.daysInMonth();
  const firstDayOfMonth = usedDate.startOf("month").day();
  const numDaysOfPreviousMonth = usedDate.subtract(1, "month").daysInMonth();
  const numOfDaysInCalendar = numDaysOfCurrentMonth + firstDayOfMonth;
  const days = [
    ...Array.from({
      length: firstDayOfMonth,
    }).map((_, i) => ({
      day: numDaysOfPreviousMonth - firstDayOfMonth + i + 1,
      date: usedDate
        .subtract(1, "month")
        .date(numDaysOfPreviousMonth - firstDayOfMonth + i + 1),
      id: `prev-${i}`,
      isToday: false,
    })),
    ...Array.from({
      length: numDaysOfCurrentMonth,
    }).map((_, i) => ({
      day: i + 1,
      date: usedDate.date(i + 1),
      id: `current-${i}`,
      isToday:
        dayjs().date() === i + 1 &&
        dayjs().month() === month &&
        dayjs().year() === year,
    })),
    ...Array.from({
      length: 35 - numOfDaysInCalendar,
    }).map((_, i) => ({
      day: i + 1,
      date: usedDate.add(1, "month").date(i + 1),
      id: `next-${i}`,
      isToday: false,
    })),
  ];

  return (
    <View className="border-2 border-primary flex-row flex-wrap rounded-lg bg-white">
      {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
        <View
          key={i}
          className="border-primary p-2 items-center justify-center"
          style={{
            width: "14.285714285714285714285714285714%",
            height: 50,
          }}
        >
          <Text className="font-bold text-secondary">{day}</Text>
        </View>
      ))}
      {days.map((day) => {
        const dayHaveActivity = activities.find((activity) =>
          day.date.isSame(activity.dateStart, "day")
        );
        return (
          <View
            key={day.id}
            className={clsx("items-center justify-center", {})}
            style={{
              width: "14.285714285714285714285714285714%",
              height: 40,
            }}
          >
            <View
              className={clsx("p-2 h-full w-full items-center justify-center")}
            >
              <View
                className={clsx(
                  "rounded-full h-[90%] w-[90%] items-center justify-center",
                  {
                    "bg-primary": day.isToday,
                    "border-2 border-cyan-500": dayHaveActivity,
                  }
                )}
              >
                <Text
                  className={clsx("text-text-disabled w-full text-center", {
                    "text-text-primary": day.id.startsWith("current"),
                    "text-white font-bold": day.isToday,
                  })}
                >
                  {day.day}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
