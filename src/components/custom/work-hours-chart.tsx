import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkHoursChartProps {
  data: { date: string; workHours: number }[];
  infoColor?: string;
}

const WorkHoursChart: React.FC<
  WorkHoursChartProps & { selectedMonth?: string; selectedYear?: string }
> = ({ data, infoColor = "var(--chart-6)", selectedMonth, selectedYear }) => {
  // Format bulan dan tahun jika ada
  let periodeLabel = "";
  if (selectedMonth && selectedYear) {
    periodeLabel = `${
      selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)
    } ${selectedYear}`;
  }
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
        <div className="grid w-full gap-3 text-center sm:text-left ">
          <div className="">
            <CardTitle className="text-lg">Work Hours Performance</CardTitle>
            <CardDescription className="">
              {periodeLabel}
            </CardDescription>
          </div>
          <div className="border-b-2 border-neutral-900 w-full"></div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={{
            Employee: { label: "Employee" },
            workHours: { label: "Work Hours", color: "hsl(var(--chart-1))" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="workHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={infoColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={infoColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="workHours"
              type="natural"
              stroke={infoColor}
              fill="url(#workHours)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WorkHoursChart;
