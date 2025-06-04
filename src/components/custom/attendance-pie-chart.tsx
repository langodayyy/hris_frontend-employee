import React from "react";
import { PieChart, Pie, Label as RechartsLabel } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface AttendanceDataItem {
  status: string;
  total: number;
  fill: string;
}

interface AttendancePieChartProps {
  attendanceData: AttendanceDataItem[];
  Days: number;
  chartConfig: any;
  selectedMonth?: string;
  selectedYear?: string;
  className?: string;
}

export const AttendancePieChart: React.FC<AttendancePieChartProps> = ({
  attendanceData,
  Days,
  chartConfig,
  className,
}) => {
  return (
    <div className="flex items-center justify-center gap-8 max-w-full w-full px-6">
      <div className="w-[250px]">
        <ChartContainer
          config={chartConfig}
          className="aspect-square min-h-[250px] flex items-center justify-center"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={attendanceData}
              dataKey="total"
              nameKey="status"
              innerRadius={60}
              strokeWidth={0}
            >
              <RechartsLabel
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {Days.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Days
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="w-[200px] flex flex-col justify-center gap-2 pr-7">
        {attendanceData.map((item) => {
          const percentage =
            Days > 0 ? ((item.total / Days) * 100).toFixed(1) : 0;
          return (
            <div key={item.status} className="flex justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></span>
                <span className="text-sm font-medium">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-400">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePieChart;
