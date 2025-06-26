"use client";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Label as UILabel } from "@/components/ui/label";
import { useState, useEffect } from "react";

import Cookies from "js-cookie";

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import AttendancePieChart from "@/components/custom/attendance-pie-chart";
import { TotalQuotaCard } from "@/components/ui/total-quota-card";
import ExpectedSalaryCard from "@/components/custom/expected-salary-card";
import { Skeleton } from "@/components/ui/skeleton";

import { toast, Toaster } from "sonner";


type WorkLog = {
  date: string;
  clockIn: string;
  clockOut: string;
};

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
   const [dashboardData, setDashboardData] = useState<{
    totalWorkHour: any[],
    totalAttendance: any[],
    leaveSummary: any,
    totalOnTime: any[],
    overtimeSummary: any[],
    monthlySalaryLastYear: any[],
    } | null>(null);

  const formatted = dashboardData?.totalWorkHour?.map(item => ({
    date: item.date,
    workHours: item.total_hour,
  })) ?? [];
  const totalMonthlyWorkHour = (dashboardData?.totalWorkHour || []).reduce((sum, item) => {
    return sum + parseFloat(item.total_hour || 0);
  }, 0);

  console.log("Total jam kerja dalam sebulan:", totalMonthlyWorkHour);

  const overtime = dashboardData?.overtimeSummary?.[0];

  const presentCount = dashboardData?.totalAttendance?.find((item) => item.status === "Present")?.count ?? 0;
  const sickLeaveCount = dashboardData?.totalAttendance?.find((item) => item.status === "Sick Leave")?.count ?? 0;
  const annualLeaveCount = dashboardData?.totalAttendance?.find((item) => item.status === "Annual Leave")?.count ?? 0;
  const absentCount = dashboardData?.totalAttendance?.find((item) => item.status === "Absent")?.count ?? 0;

  const attendanceData = [
    { status: "Present", total: presentCount, fill: "var(--present)" },
    { status: "annual Leave", total: annualLeaveCount, fill: "var(--annualLeave)" },
    { status: "Sick Leave", total: sickLeaveCount, fill: "var(--sickLeave)" },
    { status: "Absent", total: absentCount, fill: "var(--absent)" },
  ];

  const enrichedSalary = (dashboardData?.monthlySalaryLastYear || []).map((item) => {
    const date = new Date(item.month);
   const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

   return {
      date: formattedDate,
      salary: item.salary,
      payroll: item.total_overtime_pay,
      totalSalary: item.total_salary_with_overtime,
    };
  });

  console.log(enrichedSalary);
  const salary = enrichedSalary.map(item => ({
    date: item.date,
    salary: item.salary,
    payroll: item.payroll,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    monthNames[now.getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    now.getFullYear().toString()
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true); // Mulai loading saat fetch dimulai
      try {
        const token = Cookies.get("token-employee");

        const monthIndex = monthNames.indexOf(selectedMonth || "") + 1;
        const month = String(monthIndex).padStart(2, "0");
        const year = selectedYear || new Date().getFullYear().toString();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/employee/dashboard?month=${month}&year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw data;
        }

        setDashboardData({
          totalWorkHour: data.totalWorkHour || [],
          totalAttendance: data.totalAttendance || [],
          leaveSummary: data.leaveSummary || {},
          totalOnTime: data.totalOnTime || [],
          overtimeSummary: data.overtimeSummary || [],
          monthlySalaryLastYear: data.monthlySalaryLastYear || [],
        });
      } catch (err) {
        let message = "Unknown error occurred";
        let messagesToShow: string[] = [];

        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          typeof (err as any).message === "string"
        ) {
          const backendError = err as {
            message: string;
            errors?: Record<string, string[]>;
          };

          if (backendError.message.toLowerCase().includes("failed to fetch")) {
            message = "Unknown error occurred";
          } else {
            message = backendError.message;
          }

          messagesToShow = backendError.errors
            ? Object.values(backendError.errors).flat()
            : [message];
        } else {
          messagesToShow = [message];
        }

        toast.error(
          <>
            <p className="text-red-700 font-bold">Error</p>
            {messagesToShow.map((msg, idx) => (
              <div key={idx} className="text-red-700">
                • {msg}
              </div>
            ))}
          </>,
          { duration: 30000 }
        );
      } finally {
        setIsLoading(false); // Selesai loading, baik sukses maupun gagal
      }
    };

    // Trigger fetch if both month & year are selected
    if (selectedMonth && selectedYear) {
      fetchDashboard();
    }
  }, [selectedMonth, selectedYear]); 

  const [isLoading, setIsLoading] = useState(true);

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

  // const Days = React.useMemo(() => {
  //   return attendanceData.reduce((acc, curr) => acc + curr.total, 0);
  // }, []);
  const Days = React.useMemo(() => {
    return attendanceData.reduce((acc, curr) => acc + curr.total, 0);
  }, [attendanceData]);

  return (
    <Sidebar title="Dashboard">
      <Toaster position="bottom-right" expand={true} richColors closeButton></Toaster>
      <div className="flex flex-col gap-[30px]">
        <div className="w-[229px]" id="period-selection">
          {" "}
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
        <div className="grid grid-cols-4 gap-[30px]" id="dashboard-cards">
          {" "}
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
                value={totalMonthlyWorkHour}
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
                value={String(dashboardData?.totalOnTime?.[0]?.total_ontime ?? 0)}

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
                value={String(dashboardData?.totalOnTime?.[0]?.total_late ?? 0)}
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
                value={absentCount}
              ></DashboardCard>
            </>
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-[385px] w-full rounded-lg" />
        ) : (
          <div id="work-hours-chart">
            {" "}
            <WorkHoursChart
              data={filteredData}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>
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
              <Card className="" id="attendance-summary">
                {" "}
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
                  <div className="border-b-2 border-neutral-100 w-full"></div>
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
              <Card
                className="px-6 gap-[10px] flex flex-col"
                id="leave-summary"
              >
                {" "}
                <CardHeader className="items-center pb-0 gap-3 px-0">
                  <div className="">
                    <CardTitle className="text-lg">Leave Summary</CardTitle>
                    <CardDescription>
                      {selectedMonth && selectedYear && `${selectedYear}`}
                    </CardDescription>
                  </div>
                  <div className="border-b-2 border-neutral-100 w-full"></div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-[10px] p-0">
                  <TotalQuotaCard
                    title="Total Quota Annual Leave"
                    value={`${dashboardData?.leaveSummary?.max_annual_leave ?? 0} Days`}
                    className="col-span-2"
                    color="bg-info-600"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Taken"
                    value={`${dashboardData?.leaveSummary?.used_annual_leave ?? 0} Days`}
                    color="bg-warning-400"
                    showFooter
                    buttonText="See Details"
                    buttonHref="/checkclock"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Remaining"
                    value={`${dashboardData?.leaveSummary?.remaining ?? 0} Days`}
                    color="bg-success-500"
                    showFooter
                    buttonText="Request Leave"
                    buttonHref="/checkclock/add"
                  ></TotalQuotaCard>
                </CardContent>
              </Card>

              {/* Expected Monthly Salary Card extracted to component */}
              <div id="expected-salary">
                {" "}
                {/* Add id around the component */}
                <ExpectedSalaryCard
                  salary={salary}
                  enrichedSalary={enrichedSalary}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  monthNames={monthNames}
                  chartConfig={chartConfig}
                />
              </div>
              <Card
                className="px-6 gap-[10px] flex flex-col"
                id="overtime-summary"
              >
                {" "}
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
                  <div className="border-b-2 border-neutral-100 w-full"></div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-[10px] p-0">
                  <TotalQuotaCard
                    title="Total Quota Overtime This Week"
                    value={`${overtime?.max_weekly_overtime ?? 0} Hours`}
                    className="col-span-2"
                    color="bg-info-600"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Taken"
                    value={`${overtime?.total_overtime_this_week ?? 0} Hours`}
                    color="bg-warning-400"
                    showFooter
                    buttonText="See Details"
                    buttonHref="/overtime"
                  ></TotalQuotaCard>
                  <TotalQuotaCard
                    title="Remaining"
                    value={`${overtime?.remaining_overtime_hour ?? 0} Hours`}
                    color="bg-success-500"
                    showFooter
                    buttonText="Request Overtime"
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
