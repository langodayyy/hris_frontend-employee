"use client";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Label as UILabel } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardCard from "@/components/ui/dashboard-card";
import * as React from "react";
import WorkHoursChart from "@/components/custom/work-hours-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import AttendancePieChart from "@/components/custom/attendance-pie-chart";
import { TotalQuotaCard } from "@/components/ui/total-quota-card";
import ExpectedSalaryCard from "@/components/custom/expected-salary-card";
import { Skeleton } from "@/components/ui/skeleton";

const workHours = [
  // June 2025
  { date: "2025-06-01", clockIn: "08:10", clockOut: "17:12" },
  //   { date: "2025-06-02", clockIn: "08:15", clockOut: "17:05" },
  { date: "2025-06-03", clockIn: "08:08", clockOut: "17:20" },
  { date: "2025-06-04", clockIn: "08:12", clockOut: "17:10" },
  { date: "2025-06-05", clockIn: "08:20", clockOut: "17:18" },
  { date: "2025-06-06", clockIn: "08:05", clockOut: "17:25" },
  //   { date: "2025-06-07", clockIn: "08:18", clockOut: "17:15" },
  //   { date: "2025-06-08", clockIn: "08:11", clockOut: "17:22" },
  //   { date: "2025-06-09", clockIn: "08:14", clockOut: "17:09" },
  { date: "2025-06-10", clockIn: "08:09", clockOut: "17:17" },
  { date: "2025-06-11", clockIn: "08:13", clockOut: "17:11" },
  { date: "2025-06-12", clockIn: "08:16", clockOut: "17:19" },
  { date: "2025-06-13", clockIn: "08:07", clockOut: "17:23" },
  { date: "2025-06-14", clockIn: "08:19", clockOut: "17:08" },
  { date: "2025-06-15", clockIn: "08:06", clockOut: "17:16" },
  //   { date: "2025-06-16", clockIn: "08:17", clockOut: "17:21" },
  //   { date: "2025-06-17", clockIn: "08:10", clockOut: "17:13" },
  { date: "2025-06-18", clockIn: "08:12", clockOut: "17:14" },
  { date: "2025-06-19", clockIn: "08:14", clockOut: "17:18" },
  { date: "2025-06-20", clockIn: "08:11", clockOut: "17:20" },
  { date: "2025-06-21", clockIn: "08:15", clockOut: "17:07" },
  { date: "2025-06-22", clockIn: "08:13", clockOut: "17:22" },
  { date: "2025-06-23", clockIn: "08:16", clockOut: "17:09" },
  { date: "2025-06-24", clockIn: "08:08", clockOut: "17:17" },
  //   { date: "2025-06-25", clockIn: "08:18", clockOut: "17:12" },
  //   { date: "2025-06-26", clockIn: "08:09", clockOut: "17:19" },
  { date: "2025-06-27", clockIn: "08:20", clockOut: "17:11" },
  { date: "2025-06-28", clockIn: "08:07", clockOut: "17:16" },
  { date: "2025-06-29", clockIn: "08:19", clockOut: "17:10" },
  { date: "2025-06-30", clockIn: "08:06", clockOut: "17:21" },
  // July 2025
  { date: "2025-07-01", clockIn: "08:10", clockOut: "17:14" },
  { date: "2025-07-02", clockIn: "08:16", clockOut: "17:08" },
  { date: "2025-07-03", clockIn: "08:09", clockOut: "17:19" },
  { date: "2025-07-04", clockIn: "08:13", clockOut: "17:11" },
  { date: "2025-07-05", clockIn: "08:18", clockOut: "17:17" },
  { date: "2025-07-06", clockIn: "08:07", clockOut: "17:22" },
  { date: "2025-07-07", clockIn: "08:15", clockOut: "17:09" },
  { date: "2025-07-08", clockIn: "08:12", clockOut: "17:20" },
  { date: "2025-07-09", clockIn: "08:14", clockOut: "17:13" },
  { date: "2025-07-10", clockIn: "08:11", clockOut: "17:18" },
  { date: "2025-07-11", clockIn: "08:17", clockOut: "17:10" },
  { date: "2025-07-12", clockIn: "08:08", clockOut: "17:16" },
  { date: "2025-07-13", clockIn: "08:19", clockOut: "17:12" },
  { date: "2025-07-14", clockIn: "08:06", clockOut: "17:21" },
  { date: "2025-07-15", clockIn: "08:20", clockOut: "17:15" },
  { date: "2025-07-16", clockIn: "08:09", clockOut: "17:23" },
  { date: "2025-07-17", clockIn: "08:13", clockOut: "17:07" },
  { date: "2025-07-18", clockIn: "08:18", clockOut: "17:19" },
  { date: "2025-07-19", clockIn: "08:07", clockOut: "17:11" },
  { date: "2025-07-20", clockIn: "08:15", clockOut: "17:16" },
  { date: "2025-07-21", clockIn: "08:12", clockOut: "17:20" },
  { date: "2025-07-22", clockIn: "08:14", clockOut: "17:08" },
  { date: "2025-07-23", clockIn: "08:11", clockOut: "17:22" },
  { date: "2025-07-24", clockIn: "08:17", clockOut: "17:09" },
  { date: "2025-07-25", clockIn: "08:08", clockOut: "17:18" },
  { date: "2025-07-26", clockIn: "08:19", clockOut: "17:13" },
  { date: "2025-07-27", clockIn: "08:06", clockOut: "17:17" },
  { date: "2025-07-28", clockIn: "08:20", clockOut: "17:12" },
  { date: "2025-07-29", clockIn: "08:09", clockOut: "17:21" },
  { date: "2025-07-30", clockIn: "08:13", clockOut: "17:10" },
  { date: "2025-07-31", clockIn: "08:18", clockOut: "17:15" },
  // August 2025
  { date: "2025-08-01", clockIn: "08:10", clockOut: "17:16" },
  { date: "2025-08-02", clockIn: "08:15", clockOut: "17:08" },
  { date: "2025-08-03", clockIn: "08:08", clockOut: "17:19" },
  { date: "2025-08-04", clockIn: "08:12", clockOut: "17:11" },
  { date: "2025-08-05", clockIn: "08:20", clockOut: "17:17" },
  { date: "2025-08-06", clockIn: "08:05", clockOut: "17:22" },
  { date: "2025-08-07", clockIn: "08:18", clockOut: "17:09" },
  { date: "2025-08-08", clockIn: "08:11", clockOut: "17:20" },
  { date: "2025-08-09", clockIn: "08:14", clockOut: "17:13" },
  { date: "2025-08-10", clockIn: "08:09", clockOut: "17:18" },
  { date: "2025-08-11", clockIn: "08:13", clockOut: "17:10" },
  { date: "2025-08-12", clockIn: "08:16", clockOut: "17:16" },
  { date: "2025-08-13", clockIn: "08:07", clockOut: "17:21" },
  { date: "2025-08-14", clockIn: "08:19", clockOut: "17:12" },
  { date: "2025-08-15", clockIn: "08:06", clockOut: "17:15" },
  { date: "2025-08-16", clockIn: "08:17", clockOut: "17:23" },
  { date: "2025-08-17", clockIn: "08:10", clockOut: "17:07" },
  { date: "2025-08-18", clockIn: "08:12", clockOut: "17:19" },
  { date: "2025-08-19", clockIn: "08:14", clockOut: "17:11" },
  { date: "2025-08-20", clockIn: "08:11", clockOut: "17:16" },
  { date: "2025-08-21", clockIn: "08:15", clockOut: "17:20" },
  { date: "2025-08-22", clockIn: "08:13", clockOut: "17:08" },
  { date: "2025-08-23", clockIn: "08:16", clockOut: "17:22" },
  { date: "2025-08-24", clockIn: "08:08", clockOut: "17:09" },
  { date: "2025-08-25", clockIn: "08:18", clockOut: "17:17" },
  { date: "2025-08-26", clockIn: "08:09", clockOut: "17:12" },
  { date: "2025-08-27", clockIn: "08:20", clockOut: "17:19" },
  { date: "2025-08-28", clockIn: "08:07", clockOut: "17:10" },
  { date: "2025-08-29", clockIn: "08:19", clockOut: "17:18" },
  { date: "2025-08-30", clockIn: "08:06", clockOut: "17:21" },
  { date: "2025-08-31", clockIn: "08:17", clockOut: "17:15" },
  // September 2025
  // { date: "2025-09-01", clockIn: "08:10", clockOut: "17:16" },
  // { date: "2025-09-02", clockIn: "08:15", clockOut: "17:08" },
  // { date: "2025-09-03", clockIn: "08:08", clockOut: "17:19" },
  // { date: "2025-09-04", clockIn: "08:12", clockOut: "17:11" },
  // { date: "2025-09-05", clockIn: "08:20", clockOut: "17:17" },
  // { date: "2025-09-06", clockIn: "08:05", clockOut: "17:22" },
  // { date: "2025-09-07", clockIn: "08:18", clockOut: "17:09" },
  // { date: "2025-09-08", clockIn: "08:11", clockOut: "17:20" },
  // { date: "2025-09-09", clockIn: "08:14", clockOut: "17:13" },
  // { date: "2025-09-10", clockIn: "08:09", clockOut: "17:18" },
  // { date: "2025-09-11", clockIn: "08:13", clockOut: "17:10" },
  // { date: "2025-09-12", clockIn: "08:16", clockOut: "17:16" },
  // { date: "2025-09-13", clockIn: "08:07", clockOut: "17:21" },
  // { date: "2025-09-14", clockIn: "08:19", clockOut: "17:12" },
  // { date: "2025-09-15", clockIn: "08:06", clockOut: "17:15" },
];

type WorkLog = {
  date: string;
  clockIn: string;
  clockOut: string;
};

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function convertLogsToWorkHours(
  logs: WorkLog[]
): { date: string; workHours: number }[] {
  const result: Record<string, number> = {};

  logs.forEach(({ date, clockIn, clockOut }) => {
    const start = parseTimeToMinutes(clockIn);
    const end = parseTimeToMinutes(clockOut);
    const duration = end - start;

    if (!result[date]) {
      result[date] = 0;
    }

    result[date] += duration;
  });

  return Object.entries(result).map(([date, workMinutes]) => ({
    date,
    workHours: workMinutes / 60,
  }));
}

const formatted = convertLogsToWorkHours(workHours);
console.log(formatted);

const attendanceData = [
  { status: "Present", total: 275, fill: "var(--present)" },
  { status: "annual Leave", total: 200, fill: "var(--annualLeave)" },
  { status: "Sick Leave", total: 287, fill: "var(--sickLeave)" },
  { status: "Absent", total: 173, fill: "var(--absent)" },
];

const attendance = {
  total: {
    label: "total",
  },
  present: {
    label: "present",
    color: "hsl(var(--present))",
  },
  sickLeave: {
    label: "Sick Leave",
    color: "hsl(var(--sickLeave))",
  },
  annualLeave: {
    label: "annual Leave",
    color: "hsl(var(--annualLeave))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--absent))",
  },
} satisfies ChartConfig;

// Ubah struktur salary agar pakai date (YYYY-MM format)
const salary = [
  { date: "2022-01", salary: 11000000, payroll: 12000000 },
  { date: "2022-02", salary: 12000000, payroll: 13000000 },
  { date: "2022-03", salary: 11200000, payroll: 12200000 },
  { date: "2022-04", salary: 15000000, payroll: 16000000 },
  { date: "2022-05", salary: 10890000, payroll: 11890000 },
  { date: "2022-06", salary: 11500000, payroll: 12500000 },
  { date: "2022-07", salary: 13000000, payroll: 14000000 },
  { date: "2022-08", salary: 12500000, payroll: 13500000 },
  { date: "2022-09", salary: 13500000, payroll: 14500000 },
  { date: "2022-10", salary: 14000000, payroll: 15000000 },
  { date: "2022-11", salary: 14500000, payroll: 15500000 },
  { date: "2022-12", salary: 15000000, payroll: 16000000 },
  { date: "2023-01", salary: 11100000, payroll: 12100000 },
  { date: "2023-02", salary: 12100000, payroll: 13100000 },
  { date: "2023-03", salary: 11300000, payroll: 12300000 },
  { date: "2023-04", salary: 15100000, payroll: 16100000 },
  { date: "2023-05", salary: 10990000, payroll: 11990000 },
  { date: "2023-06", salary: 11600000, payroll: 12600000 },
  { date: "2023-07", salary: 13100000, payroll: 14100000 },
  { date: "2023-08", salary: 12600000, payroll: 13600000 },
  { date: "2023-09", salary: 13600000, payroll: 14600000 },
  { date: "2023-10", salary: 14100000, payroll: 15100000 },
  { date: "2023-11", salary: 14600000, payroll: 15600000 },
  { date: "2023-12", salary: 15100000, payroll: 16100000 },
  { date: "2025-01", salary: 10000000, payroll: 3000000 },
  { date: "2025-02", salary: 10000000, payroll: 2000000 },
  { date: "2025-03", salary: 10000000, payroll: 1000000 },
  { date: "2025-04", salary: 10000000, payroll: 500000 },
  { date: "2025-05", salary: 10000000, payroll: 290000 },
  { date: "2025-06", salary: 10000000, payroll: 900000 },
  // { date: "2025-07", salary: 13200000, payroll: 14200000 },
  // { date: "2025-08", salary: 12700000, payroll: 13700000 },
  // { date: "2025-09", salary: 13700000, payroll: 14700000 },
  // { date: "2025-10", salary: 14200000, payroll: 15200000 },
  // { date: "2025-11", salary: 14700000, payroll: 15700000 },
  // { date: "2025-12", salary: 15200000, payroll: 16200000 },
];

// Ubah enrichedSalary agar pakai date
const enrichedSalary = salary.map((item) => ({
  ...item,
  totalSalary: item.salary + item.payroll,
}));
console.log(enrichedSalary);

const chartConfig = {
  salary: {
    label: "Salary",
    color: "#2d8eff",
  },
  payroll: {
    label: "Payroll",
    color: "#ffcd1b",
  },
  totalSalary: {
    label: "Total Salary ",
    color: "#3aad61",
  },
};

const now = new Date();
const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    monthNames[now.getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    now.getFullYear().toString()
  );

  const [isLoading, setIsLoading] = useState(true);

  // Simulasi untuk mengubah isLoading menjadi FALSE setelah beberapa waktu (SIMULASI SAJA SEBELUM FETCHING)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Setelah 1.5 detik, ubah isLoading jadi FALSE
    }, 3000); // 1500 milidetik = 1.5 detik
    return () => clearTimeout(timer);
  }, []);

  // Filter data berdasarkan bulan dan tahun yang dipilih
  const filteredData = React.useMemo(() => {
    if (!selectedMonth || !selectedYear) return formatted;
    const monthIndex = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ].indexOf(selectedMonth);
    return formatted.filter((item) => {
      const dateObj = new Date(item.date);
      return (
        dateObj.getMonth() === monthIndex &&
        dateObj.getFullYear().toString() === selectedYear
      );
    });
  }, [selectedMonth, selectedYear, formatted]);

  const Days = React.useMemo(() => {
    return attendanceData.reduce((acc, curr) => acc + curr.total, 0);
  }, []);

  return (
    <Sidebar title="Dashboard">
      <div className="flex flex-col gap-[30px]">
        <div className="w-[229px]">
          {isLoading ? (
            <Skeleton className="h-[40px] w-[229px] rounded-md" />
          ) : (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button className="flex gap-[10px] justify-between">
                  <span>
                    {selectedMonth && selectedYear
                      ? `${
                          selectedMonth.charAt(0).toUpperCase() +
                          selectedMonth.slice(1)
                        } ${selectedYear}`
                      : "Choose a Periode"}
                  </span>
                  {isOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M6 15l6 -6l6 6" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M6 9l6 6l6 -6" />
                    </svg>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex gap-3.5 w-fit z-0" align="start">
                <div className="flex flex-col gap-2">
                  <UILabel>Month</UILabel>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger className="min-w-[157px]">
                      <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="february">February</SelectItem>
                        <SelectItem value="march">March</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="may">May</SelectItem>
                        <SelectItem value="june">June</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="august">August</SelectItem>
                        <SelectItem value="september">September</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                        <SelectItem value="november">November</SelectItem>
                        <SelectItem value="december">December</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <UILabel>Year</UILabel>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="min-w-[143px]">
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Year</SelectLabel>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="grid grid-cols-4 gap-[30px]">
          {isLoading ? (
            <>
              <Skeleton className="h-[135px] w-full rounded-lg" />
              <Skeleton className="h-[135px] w-full rounded-lg" />
              <Skeleton className="h-[135px] w-full rounded-lg" />
              <Skeleton className="h-[135px] w-full rounded-lg" />
            </>
          ) : (
            <>
              <DashboardCard
                icon={
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.2301 15.6688C26.3657 13.3917 25.806 11.1273 24.6251 9.17569C23.4442 7.22409 21.6979 5.67758 19.6179 4.74125C17.5379 3.80492 15.2224 3.52301 12.9784 3.9329C10.7345 4.3428 8.66819 5.42513 7.05352 7.03637C5.43886 8.6476 4.35213 10.7116 3.93746 12.9547C3.52279 15.1977 3.79977 17.5138 4.73168 19.5958C5.66358 21.6779 7.20637 23.4274 9.15545 24.6125C11.1045 25.7975 13.3678 26.3621 15.6451 26.2313M20 23.75H27.5M23.75 20V27.5M15 8.75V15L18.75 18.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Total Work Hours"
                value="222 Hours"
              ></DashboardCard>
              <DashboardCard
                icon={
                  <svg
                    width="25"
                    height="26"
                    viewBox="0 0 25 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.4274 14.2763C23.6832 12.0361 23.2599 9.77071 22.2125 7.77401C21.1651 5.77731 19.5419 4.14141 17.5534 3.07851C15.5649 2.0156 13.3029 1.57472 11.0608 1.81307C8.81865 2.05142 6.69989 2.95799 4.97931 4.4152C3.25872 5.8724 2.0157 7.813 1.41147 9.98527C0.807248 12.1576 0.869703 14.4613 1.59073 16.5976C2.31177 18.734 3.65811 20.6044 5.45512 21.9662C7.25213 23.328 9.4169 24.1185 11.6686 24.235M12.25 6.74999V13L16 16.75M16 21.75L18.5 24.25L23.5 19.25"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="On Time"
                value="120 Times"
              ></DashboardCard>
              <DashboardCard
                icon={
                  <svg
                    width="25"
                    height="27"
                    viewBox="0 0 25 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.7326 13.6275C23.867 11.2156 23.2214 8.82456 21.8915 6.80801C20.5616 4.79145 18.618 3.25652 16.3481 2.43026C14.0782 1.604 11.6026 1.53031 9.28756 2.22009C6.97253 2.90986 4.941 4.32647 3.4935 6.26035C2.046 8.19423 1.25941 10.5427 1.25008 12.9583C1.24076 15.3738 2.0092 17.7283 3.44173 19.6733C4.87425 21.6183 6.89479 23.0505 9.20442 23.7581C11.5141 24.4658 13.9901 24.4112 16.2663 23.6025M12.5 6.75V13L16.25 16.75M21.25 18V21.75M21.25 25.5V25.5125"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Late"
                value="30 Times"
              ></DashboardCard>
              <DashboardCard
                icon={
                  <svg
                    width="22"
                    height="21"
                    viewBox="0 0 22 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.7465 10.25C19.7967 8.44812 19.3047 6.67268 18.3342 5.15367C17.3637 3.63466 15.9594 2.44208 14.3032 1.73042C12.6471 1.01875 10.8154 0.820795 9.04546 1.16219C7.27551 1.50359 5.64885 2.36861 4.37621 3.64519C3.10357 4.92177 2.24359 6.5511 1.90767 8.32209C1.57174 10.0931 1.77536 11.9242 2.49215 13.5781C3.20893 15.232 4.40585 16.6326 5.92785 17.5984C7.44985 18.5642 9.2268 19.0508 11.0285 18.995M15.75 19L19.75 15M10.75 5V10L12.75 12M14.75 17C14.75 17.7956 15.0661 18.5587 15.6287 19.1213C16.1913 19.6839 16.9544 20 17.75 20C18.5456 20 19.3087 19.6839 19.8713 19.1213C20.4339 18.5587 20.75 17.7956 20.75 17C20.75 16.2044 20.4339 15.4413 19.8713 14.8787C19.3087 14.3161 18.5456 14 17.75 14C16.9544 14 16.1913 14.3161 15.6287 14.8787C15.0661 15.4413 14.75 16.2044 14.75 17Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                title="Absent"
                value="5 Times"
              ></DashboardCard>
            </>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-[385px] w-full rounded-lg" />
        ) : (
          <WorkHoursChart
            data={filteredData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        )}
        <div className="grid grid-cols-2 gap-[30px]">
          {isLoading ? (
            <>
              <Skeleton className="h-[385px] w-full rounded-lg" />
              <Skeleton className="h-[385px] w-full rounded-lg" />
              <Skeleton className="h-[385px] w-full rounded-lg" />
              <Skeleton className="h-[385px] w-full rounded-lg" />
            </>
          ) : (
            <>
              <Card className="">
                <CardHeader className="items-center pb-0 gap-3">
                  <div className="">
                    <CardTitle className="text-lg">
                      Attendance Summary
                    </CardTitle>
                    <CardDescription>
                      {selectedMonth &&
                        selectedYear &&
                        `${
                          selectedMonth.charAt(0).toUpperCase() +
                          selectedMonth.slice(1)
                        } ${selectedYear}`}
                    </CardDescription>
                  </div>
                  <div className="border-b-2 border-neutral-900 w-full"></div>
                </CardHeader>
                <div className="flex items-center justify-center max-h-[300px]">
                  <AttendancePieChart
                    attendanceData={attendanceData}
                    Days={Days}
                    chartConfig={attendance}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                </div>
              </Card>
              <Card className="px-6 gap-[10px] flex flex-col">
                <CardHeader className="items-center pb-0 gap-3 px-0">
                  <div className="">
                    <CardTitle className="text-lg">Leave Summary</CardTitle>
                    <CardDescription>
                      {selectedMonth && selectedYear && `${selectedYear}`}
                    </CardDescription>
                  </div>
                  <div className="border-b-2 border-neutral-900 w-full"></div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-[10px] p-0">
                  <TotalQuotaCard
                    title="Total Quota Annual Leave"
                    value="14 Days"
                    className="col-span-2"
                    color="bg-info-600"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Taken"
                    value="0 Days"
                    color="bg-warning-400"
                    showFooter
                    buttonText="See Details"
                    buttonHref="/checkclock"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Remaining"
                    value="14 Days"
                    color="bg-success-500"
                    showFooter
                    buttonText="Request Leave"
                    buttonHref="/checkclock/add"
                  ></TotalQuotaCard>
                </CardContent>
              </Card>

              {/* Expected Monthly Salary Card extracted to component */}
              <ExpectedSalaryCard
                salary={salary}
                enrichedSalary={enrichedSalary}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                monthNames={monthNames}
                chartConfig={chartConfig}
              />
              <Card className="px-6 gap-[10px] flex flex-col">
                <CardHeader className="items-center pb-0 gap-3 px-0">
                  <div className="">
                    <CardTitle className="text-lg">Overtime Summary</CardTitle>
                    <CardDescription>
                      {selectedMonth &&
                        selectedYear &&
                        `${
                          selectedMonth.charAt(0).toUpperCase() +
                          selectedMonth.slice(1)
                        } ${selectedYear}`}
                    </CardDescription>
                  </div>
                  <div className="border-b-2 border-neutral-900 w-full"></div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-[10px] p-0">
                  <TotalQuotaCard
                    title="Total Quota Overtime This Month"
                    value="20 Hours"
                    className="col-span-2"
                    color="bg-info-600"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Taken"
                    value="5 Hours"
                    color="bg-warning-400"
                    showFooter
                    buttonText="See Details"
                    buttonHref="/overtime"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Remaining"
                    value="15 Hours"
                    color="bg-success-500"
                    showFooter
                    buttonText="Request Leave"
                    buttonHref="/overtime/add"
                  ></TotalQuotaCard>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
