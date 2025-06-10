"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import * as React from "react";
import { CheckclockOverview, columns } from "./columns";
import { DataTable } from "./data-table";
import { useFormContext } from "@/components/context/FormContext";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { CheckclockResponse } from "../types/checkclock";
import { Skeleton } from "@/components/ui/skeleton";
// import Cookies from "js-cookie";

export default function CheckclockOverviewPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [allData, setAllData] = useState<CheckclockOverview[]>([]);
  const [data, setData] = useState<CheckclockOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCalendarChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);

    if (!selectedDate) {
      setData(allData);
      return;
    }

    const selected = new Date(selectedDate);

    const filtered = allData.filter((item) => {
      if (!item.date || typeof item.date !== "string") return false;

      const itemDate = new Date(item.date);

      // Compare only date parts (ignore time)
      return (
        itemDate.getFullYear() === selected.getFullYear() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getDate() === selected.getDate()
      );
    });

    console.log("data now", filtered);
    setData(filtered);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCheckClock();

        if (response.success && response.data) {
          const transformedData: CheckclockOverview[] = response.data.map(
            (item: CheckclockResponse) => {
              const shouldClearStatus =
                item.approval_status !== "Rejected" &&
                (item.status === "Late" ||
                  item.status === "On Time" ||
                  item.status === "Absent");

              return {
                data_id: item.data_id,
                date: item.date,
                clockIn: item.clock_in || "--:--",
                clockOut: item.clock_out || "--:--",
                workType: item.work_type,
                status: item.status,
                approvalStatus: shouldClearStatus ? "" : item.approval_status,
                latitude: item.latitude || null,
                longitude: item.longitude || null,
                startDate: item.absent_start_date || "-",
                endDate: item.absent_end_date || "-",
                reason: item.reject_reason,
              };
            }
          );

          setAllData(transformedData); // sets for calendar filter use

          // Filter by today's date directly using transformedData
          const today = new Date();
          const todayStr = today.toISOString().slice(0, 10);

          const filtered = transformedData.filter((item) => {
            if (!item.date || typeof item.date !== "string") return false;

            const itemDateStr = new Date(item.date).toISOString().slice(0, 10);
            return itemDateStr === todayStr;
          });

          console.log("Filtered today data", filtered);
          setDate(today); // update calendar
          setData(filtered); // show today's data
        } else {
          setError(response.errors?.general?.[0] || "Failed to fetch data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  // from lucky
  // const [data, setData] = useState<CheckclockOverview[]>([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     // Simulate additional table data for Annual Leave and Sick Leave
  //     const leaveData = Array.from({ length: 20 }, (_, i) => {
  //       const startDate = `2023-10-${String(
  //         Math.floor(Math.random() * 30) + 1
  //       ).padStart(2, "0")}`;
  //       const endDate = `2023-10-${String(
  //         Math.min(
  //           30,
  //           parseInt(startDate.split("-")[2]) +
  //             Math.floor(Math.random() * 5) +
  //             1
  //         )
  //       ).padStart(2, "0")}`;

  //       return {
  //         employeeId: i + 1,
  //         status: ["Annual Leave", "Sick Leave"][Math.floor(Math.random() * 2)],
  //         startDate,
  //         endDate,
  //       };
  //     });

  //     const dynamicData = Array.from({ length: 50 }, (_, i) => {
  //       const statusOptions = [
  //         "On Time",
  //         "Late",
  //         ...(Math.random() < 0.3 ? ["Absent"] : []),
  //         "Sick Leave",
  //         "Annual Leave",
  //       ];
  //       const status =
  //         statusOptions[Math.floor(Math.random() * statusOptions.length)];

  //       // 1 dari 2 data 'Absent' akan punya clockIn/clockOut, 1 lagi tidak
  //       const isAbsent = status === "Absent";
  //       let clockIn = "--:--";
  //       let clockOut = "--:--";
  //       if (isAbsent) {
  //         // Setengah dari data 'Absent' punya jam, setengah tidak
  //         if (i % 2 === 0) {
  //           clockIn = "08:00";
  //           clockOut = "17:00";
  //         }
  //       } else if (!["Sick Leave", "Annual Leave"].includes(status)) {
  //         clockIn = `${String(Math.floor(Math.random() * 3) + 8).padStart(
  //           2,
  //           "0"
  //         )}:00`;
  //         clockOut = `${String(Math.floor(Math.random() * 3) + 17).padStart(
  //           2,
  //           "0"
  //         )}:00`;
  //       }

  //       // Find leave data for the current employee if status is Sick Leave or Annual Leave
  //       const leaveInfo = leaveData.find(
  //         (leave) => leave.employeeId === i + 1 && leave.status === status
  //       );

  //       const workType = ["WFO", "WFA"][Math.floor(Math.random() * 2)];

  //       return {
  //         id: i + 1,
  //         employeeName: `Employee Name 00 ${i + 1}`,
  //         position: ["CEO", "Manager", "HRD", "Supervisor", "OB"][
  //           Math.floor(Math.random() * 5)
  //         ],
  //         date: leaveInfo
  //           ? { startDate: leaveInfo.startDate, endDate: leaveInfo.endDate }
  //           : `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(
  //               2,
  //               "0"
  //             )}`,
  //         clockIn,
  //         clockOut,
  //         workType,
  //         location:
  //           clockIn !== "--:--"
  //             ? ["Malang", "Jakarta", "Surabaya", "Bandung"][
  //                 Math.floor(Math.random() * 4)
  //               ]
  //             : "-",
  //         address: clockIn !== "--:--" ? `Address ${i + 1}` : "",
  //         latitude:
  //           clockIn !== "--:--"
  //             ? parseFloat((Math.random() * 90).toFixed(6))
  //             : 0,
  //         longitude:
  //           clockIn !== "--:--"
  //             ? parseFloat((Math.random() * 180).toFixed(6))
  //             : 0,
  //         status,
  //         approvalStatus: ["Sick Leave", "Annual Leave"].includes(status)
  //           ? ["Approved", "Pending", "Rejected"][Math.floor(Math.random() * 3)]
  //           : undefined,
  //       };
  //     });

  //     // Tambahkan dua data Absent secara eksplisit di awal
  //     const absentWithClock = {
  //       id: 1001,
  //       employeeName: "Absent With Clock",
  //       position: "OB",
  //       date: "2023-10-01",
  //       clockIn: "08:00",
  //       clockOut: "17:00",
  //       workType: "WFO",
  //       location: "Jakarta",
  //       address: "Address Absent With Clock",
  //       latitude: -6.2,
  //       longitude: 106.8,
  //       status: "Absent",
  //       approvalStatus: undefined,
  //       reason: undefined,
  //     };
  //     const absentNoClock = {
  //       id: 1002,
  //       employeeName: "Absent No Clock",
  //       position: "OB",
  //       date: "2023-10-02",
  //       clockIn: "--:--",
  //       clockOut: "--:--",
  //       workType: "WFO",
  //       location: "-",
  //       address: "",
  //       latitude: 0,
  //       longitude: 0,
  //       status: "Absent",
  //       approvalStatus: undefined,
  //       reason: undefined,
  //     };

  //     console.log("Leave Data:", leaveData);
  //     console.log("Dynamic Data:", dynamicData);
  //     console.log(dynamicData);
  //     setData([absentWithClock, absentNoClock, ...dynamicData]);
  //   }

  //   fetchData();
  // }, []);
  // const { success, setSuccess } = useFormContext();
  // useEffect(() => {
  //   if (success && Object.keys(success).length > 0) {
  //     toast.success(`${success.attendance}`);
  //     console.log(success);
  //     setSuccess({}); 
  //   }
  // }, [success]); 

  return (
    <Sidebar title="Checkclock">
       <Toaster position="bottom-right" expand={true} />
      <div className=" bg-white rounded-[15px] p-5 flex flex-col gap-[10px]">
        <div className="container mx-auto">
          <DataTable columns={columns} data={data}
          date={date}
            onDateChange={handleCalendarChange}/>
        </div>
      </div>
    </Sidebar>
  );
}

export async function getCheckClock() {
  try {
    const userCookie = Cookies.get("token-employee");
    console.log(userCookie);
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

      console.log(response)

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