import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface SalaryItem {
  date: string;
  salary: number;
  payroll: number;
}

interface EnrichedSalaryItem extends SalaryItem {
  totalSalary: number;
}

interface ExpectedSalaryCardProps {
  salary: SalaryItem[];
  enrichedSalary: EnrichedSalaryItem[];
  selectedMonth?: string;
  selectedYear?: string;
  monthNames: string[];
  chartConfig: any;
}

const ExpectedSalaryCard: React.FC<ExpectedSalaryCardProps> = ({
  salary,
  enrichedSalary,
  selectedMonth,
  selectedYear,
  monthNames,
  chartConfig,
}) => {
  return (
    <Card className="gap-[10px]">
      <CardHeader className="items-center pb-0 gap-3">
        <div className="">
          <CardTitle className="text-lg">Expected Monthly Salary</CardTitle>
          <CardDescription>
            {selectedMonth &&
              selectedYear &&
              `${
                selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)
              } ${selectedYear}`}
          </CardDescription>
        </div>
        <div className="border-b-2 border-neutral-900 w-full"></div>
      </CardHeader>
      <CardContent className="gap-[10px] flex flex-col">
        <Card className="p-[20px] gap-[10px]">
          <CardHeader className="flex gap-[25px] items-center p-0">
            <span className="w-3 h-3 rounded-full bg-primary-900"></span>
            <span className="text-neutral-900 font-medium text-base">
              Expected Salary This Month
            </span>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-[10px]">
            <span className="font-bold text-3xl">
              IDR{" "}
              {(() => {
                const monthIndex = monthNames.indexOf(selectedMonth ?? "");
                const year = selectedYear;
                const dateStr =
                  year && monthIndex >= 0
                    ? `${year}-${(monthIndex + 1).toString().padStart(2, "0")}`
                    : "";
                const salaryItem = salary.find((item) => item.date === dateStr);
                const baseSalary = salaryItem?.salary ?? 0;
                const overtimeFee = salaryItem?.payroll ?? 0;
                return (baseSalary + overtimeFee).toLocaleString("en-US");
              })()}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Base Salary:</span>
                <span>
                  {(() => {
                    const monthIndex = monthNames.indexOf(selectedMonth ?? "");
                    const year = selectedYear;
                    const dateStr =
                      year && monthIndex >= 0
                        ? `${year}-${(monthIndex + 1)
                            .toString()
                            .padStart(2, "0")}`
                        : "";
                    const salaryItem = salary.find(
                      (item) => item.date === dateStr
                    );
                    return salaryItem?.salary?.toLocaleString("en-US") ?? "-";
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>+ Total Overtime Fee</span>
                <span>
                  {(() => {
                    const monthIndex = monthNames.indexOf(selectedMonth ?? "");
                    const year = selectedYear;
                    const dateStr =
                      year && monthIndex >= 0
                        ? `${year}-${(monthIndex + 1)
                            .toString()
                            .padStart(2, "0")}`
                        : "";
                    const salaryItem = salary.find(
                      (item) => item.date === dateStr
                    );
                    return salaryItem?.payroll?.toLocaleString("en-US") ?? "-";
                  })()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none">
          <ChartContainer config={chartConfig} className="h-[70px]">
            <LineChart
              accessibilityLayer
              data={enrichedSalary.filter((item) =>
                selectedYear ? item.date.startsWith(selectedYear) : true
              )}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => {
                  const [_, mm] = value.split("-");
                  const monthIdx = parseInt(mm, 10) - 1;
                  return monthNames[monthIdx]?.slice(0, 3) ?? value;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="totalSalary"
                type="natural"
                stroke="var(--salary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ExpectedSalaryCard;
