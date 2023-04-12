import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import colors from "tailwindcss/colors";
import { getActivities, getActivitiesDailyStats } from "../api/activities";
import dayjs from "dayjs";
import { DayStats } from "../models/DayStats";
import { Button } from "../components/Button";

function CustomLineChart({ labels, datasets, currency }: any) {
  return (
    <LineChart
      data={{
        labels,
        datasets,
      }}
      width={Dimensions.get("window").width}
      height={220}
      yAxisLabel={currency ? "R$" : ""}
      yAxisInterval={1}
      chartConfig={{
        backgroundGradientFrom: colors.gray[100],
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: colors.gray[100],
        backgroundGradientToOpacity: 0,
        backgroundColor: colors.white,
        decimalPlaces: currency ? 2 : 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "4",
          strokeWidth: "2",
          stroke: colors.gray[800],
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
}

function getDates(stats: DayStats[]) {
  if (stats.length === 0) {
    return [];
  }
  const firstDay = stats[0].date;
  const lastDay = stats[stats.length - 1].date;
  const dates: DayStats[] = [];
  const start = dayjs(firstDay).startOf("day");
  const end = dayjs(lastDay).startOf("day");
  let current = start.clone();
  while (current.isSame(end) || current.isBefore(end)) {
    const currentStats = stats.find((s) => dayjs(s.date).isSame(current));
    dates.push(
      currentStats
        ? currentStats
        : {
            date: current.toString(),
            activities: 0,
            total_value: 0,
          }
    );
    current = current.add(1, "day");
  }

  return dates;
}

function groupDaysToMonths(
  days: DayStats[]
): Array<{ month: string; activities: number; total_value: number }> {
  if (days.length === 0) {
    return [];
  }
  return days.reduce((acc, day) => {
    const month = dayjs(day.date).format("MM/YYYY");
    const monthStats = acc.find((s) => s.month === month);
    if (monthStats) {
      monthStats.activities += day.activities;
      monthStats.total_value += day.total_value;
    } else {
      acc.push({ month, ...day });
    }
    return acc;
  }, [] as Array<{ month: string; activities: number; total_value: number }>);
}

export default function Charts() {
  const { refetch, data, isFetching } = useQuery({
    queryFn: getActivitiesDailyStats,
    queryKey: ["dailyStats"],
  });

  const stats = data?.data || [];
  const days = getDates(stats);
  const months = groupDaysToMonths(days);
  const labels = months.map((month) => month.month);
  const datasetsActivities = [
    {
      data: months.map((day) => day.activities),
    },
  ];

  const datasetsValue = [
    {
      data: months.map((day) => day.total_value),
    },
  ];
  console.log({
    stats,
    days,
    months,
    labels,
    datasetsActivities,
    datasetsValue,
  });
  if (isFetching) {
    return <Text>Loading...</Text>;
  }
  if (!stats.length) {
    return <Text>No data yet</Text>;
  }
  return (
    <View className="p-2">
      <View className="w-full">
        <Text className="text-lg font-bold">Atividades por mês</Text>
        <CustomLineChart labels={labels} datasets={datasetsActivities} />
      </View>
      <Text className="text-lg font-bold mt-5">Ganhos por mês</Text>
      <CustomLineChart labels={labels} datasets={datasetsValue} currency />

      <Button onPress={() => refetch()} text="Reload" />
    </View>
  );
}
