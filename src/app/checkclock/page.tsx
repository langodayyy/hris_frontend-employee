"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import * as React from "react";
import { CheckclockOverview, columns } from "./columns";
import { DataTable } from "./data-table";
import { useFormContext } from "@/components/context/FormContext";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
// import Cookies from "js-cookie";

export default function CheckclockOverviewPage() {
  const [data, setData] = useState<CheckclockOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Simulate additional table data for Annual Leave and Sick Leave
      const leaveData = Array.from({ length: 20 }, (_, i) => {
        const startDate = `2023-10-${String(
          Math.floor(Math.random() * 30) + 1
        ).padStart(2, "0")}`;
        const endDate = `2023-10-${String(
          Math.min(
            30,
            parseInt(startDate.split("-")[2]) +
              Math.floor(Math.random() * 5) +
              1
          )
        ).padStart(2, "0")}`;

        return {
          employeeId: i + 1,
          status: ["Annual Leave", "Sick Leave"][Math.floor(Math.random() * 2)],
          startDate,
          endDate,
        };
      });

      const dynamicData = Array.from({ length: 50 }, (_, i) => {
        const statusOptions = [
          "On Time",
          "Late",
          ...(Math.random() < 0.3 ? ["Absent"] : []),
          "Sick Leave",
          "Annual Leave",
        ];
        const status =
          statusOptions[Math.floor(Math.random() * statusOptions.length)];

        // 1 dari 2 data 'Absent' akan punya clockIn/clockOut, 1 lagi tidak
        const isAbsent = status === "Absent";
        let clockIn = "--:--";
        let clockOut = "--:--";
        if (isAbsent) {
          // Setengah dari data 'Absent' punya jam, setengah tidak
          if (i % 2 === 0) {
            clockIn = "08:00";
            clockOut = "17:00";
          }
        } else if (!["Sick Leave", "Annual Leave"].includes(status)) {
          clockIn = `${String(Math.floor(Math.random() * 3) + 8).padStart(
            2,
            "0"
          )}:00`;
          clockOut = `${String(Math.floor(Math.random() * 3) + 17).padStart(
            2,
            "0"
          )}:00`;
        }

        // Find leave data for the current employee if status is Sick Leave or Annual Leave
        const leaveInfo = leaveData.find(
          (leave) => leave.employeeId === i + 1 && leave.status === status
        );

        const workType = ["WFO", "WFA"][Math.floor(Math.random() * 2)];

        return {
          id: i + 1,
          employeeName: `Employee Name 00 ${i + 1}`,
          position: ["CEO", "Manager", "HRD", "Supervisor", "OB"][
            Math.floor(Math.random() * 5)
          ],
          date: leaveInfo
            ? { startDate: leaveInfo.startDate, endDate: leaveInfo.endDate }
            : `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(
                2,
                "0"
              )}`,
          clockIn,
          clockOut,
          workType,
          location:
            clockIn !== "--:--"
              ? ["Malang", "Jakarta", "Surabaya", "Bandung"][
                  Math.floor(Math.random() * 4)
                ]
              : "-",
          address: clockIn !== "--:--" ? `Address ${i + 1}` : "",
          latitude:
            clockIn !== "--:--"
              ? parseFloat((Math.random() * 90).toFixed(6))
              : 0,
          longitude:
            clockIn !== "--:--"
              ? parseFloat((Math.random() * 180).toFixed(6))
              : 0,
          status,
          approvalStatus: ["Sick Leave", "Annual Leave"].includes(status)
            ? ["Approved", "Pending", "Rejected"][Math.floor(Math.random() * 3)]
            : undefined,
        };
      });

      // Tambahkan dua data Absent secara eksplisit di awal
      const absentWithClock = {
        id: 1001,
        employeeName: "Absent With Clock",
        position: "OB",
        date: "2023-10-01",
        clockIn: "08:00",
        clockOut: "17:00",
        workType: "WFO",
        location: "Jakarta",
        address: "Address Absent With Clock",
        latitude: -6.2,
        longitude: 106.8,
        status: "Absent",
        approvalStatus: undefined,
        reason: undefined,
      };
      const absentNoClock = {
        id: 1002,
        employeeName: "Absent No Clock",
        position: "OB",
        date: "2023-10-02",
        clockIn: "--:--",
        clockOut: "--:--",
        workType: "WFO",
        location: "-",
        address: "",
        latitude: 0,
        longitude: 0,
        status: "Absent",
        approvalStatus: undefined,
        reason: undefined,
      };

      console.log("Leave Data:", leaveData);
      console.log("Dynamic Data:", dynamicData);
      console.log(dynamicData);
      setData([absentWithClock, absentNoClock, ...dynamicData]);
      setIsLoading(false);
    }

    fetchData();
  }, []);
  const { success, setSuccess } = useFormContext();
  useEffect(() => {
    if (success && Object.keys(success).length > 0) {
      toast.success(`${success.attendance}`);
      console.log(success);
      setSuccess({}); 
    }
  }, [success]); 

  return (
    <Sidebar title="Checkclock">
       <Toaster position="bottom-right" expand={true} />
       {isLoading ? (
        <Skeleton className="rounded-[15px] w-full min-h-[230px] " />
      ) : (
      <div className=" bg-white rounded-[15px] p-5 flex flex-col gap-[10px]" id="checkclock">
        <div className="container mx-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
      )}
    </Sidebar>
  );
}

// export async function getCheckClock() {
//   try {
//     const userCookie = Cookies.get("token");
//     if (userCookie) {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/check-clocks`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userCookie}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         // If the response is not OK, parse the error response
//         const errorData = await response.json();
//         return { success: false, errors: errorData.errors };
//       }

//       // Parse and return the success response
//       const responseData = await response.json();
//       return { success: true, data: responseData };
//     } else {
//       return {
//         success: false,
//         errors: { general: ["User token not found"] },
//       };
//     }
//   } catch (error: any) {
//     // Handle network or other unexpected errors
//     return {
//       success: false,
//       errors: { general: [error.message || "An unexpected error occurred"] },
//     };
//   }
// }
