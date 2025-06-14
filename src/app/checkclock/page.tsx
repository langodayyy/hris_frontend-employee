"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import * as React from "react";
import { CheckclockOverview, columns } from "./columns";
import { DataTable } from "./data-table";
import { useFormContext } from "@/components/context/FormContext";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { CheckclockResponse } from "../../types/checkclock";
import { Skeleton } from "@/components/ui/skeleton";
import { useCKSettingData } from "@/hooks/useCheckClockData";
import { format } from "date-fns";
// import Cookies from "js-cookie";

export default function CheckclockOverviewPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [allData, setAllData] = useState<CheckclockOverview[]>([]);
  const [data, setData] = useState<CheckclockOverview[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [locationRule, setLocationRule] = useState([]);

  const { error, checkClockData, locationRule } = useCKSettingData();

  useEffect(() => {
    if (checkClockData) {
      const transformedData: CheckclockOverview[] = checkClockData.map(
        (item: CheckclockResponse) => {
          const shouldClearStatus =
            item.approval_status !== "Rejected" &&
            ["Late", "On Time", "Absent"].includes(item.status);

          return {
            id: Number(item.data_id),
            date: item.date, // ← this is the correct date to filter on
            clockIn: item.clock_in || "--:--",
            clockOut: item.clock_out || "--:--",
            workType: item.work_type,
            status: item.status,
            approvalStatus: shouldClearStatus ? "" : item.approval_status,
            reason: item.reject_reason ?? undefined,
          };
        }
      );
      setAllData(transformedData);
      setData(transformedData);
      setDate(undefined);
      setLoading(false);
    }
  }, [checkClockData]);


const handleCalendarChange = (selectedDate: Date | undefined) => {
  setDate(selectedDate);

  if (!selectedDate) {
    setData(allData);
    return;
  }

  // Use format to prevent timezone shift issues
  const selectedStr = format(selectedDate, "yyyy-MM-dd");

  // Filter only by direct string date
  const filtered = allData.filter((item) => item.date === selectedStr);

  setData(filtered);
};


  if (loading) {
    return (
      <Sidebar title="Checkclock">
        <Skeleton className="w-full h-[400px]"></Skeleton>
      </Sidebar>
    );
  }

  if (error) {
    console.error(error);
    return (
      <Sidebar title="Checkclock">
        <div>Error: {error}</div>
      </Sidebar>
    );
  }

  console.log(allData.map((d) => d.date));
  console.log("state", date);

  return (
    <Sidebar title="Checkclock">
       <Toaster position="bottom-right" expand={true} />
       {loading ? (
        <Skeleton className="rounded-[15px] w-full min-h-[230px] " />
      ) : (
      <div className=" bg-white rounded-[15px] p-5 flex flex-col gap-[10px]" id="checkclock">
        <div className="container mx-auto">
          <DataTable
            columns={columns}
            data={data}
            date={date}
            onDateChange={handleCalendarChange}
          />
        </div>
      </div>
      )}
    </Sidebar>
  );
}

export async function getCheckClock() {
  try {
    const userCookie = Cookies.get("token-employee");
    if (userCookie) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-clocks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userCookie}`,
          },
        }
      );

      if (!response.ok) {
        // If the response is not OK, parse the error response
        const errorData = await response.json();
        return { success: false, errors: errorData.errors };
      }

      // Parse and return the success response
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      return {
        success: false,
        errors: { general: ["User token not found"] },
      };
    }
  } catch (error: any) {
    // Handle network or other unexpected errors
    return {
      success: false,
      errors: { general: [error.message || "An unexpected error occurred"] },
    };
  }
}
