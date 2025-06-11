"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import * as React from "react";
import { OvertimeOverview, columns } from "./columns";
import { DataTable } from "./data-table";
import { useFormContext } from "@/components/context/FormContext";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
// import Cookies from "js-cookie";

export default function OvertimeOverviewPage() {
  const [data, setData] = useState<OvertimeOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const overtimeTypes = ["Weekday", "Weekend", "Holiday"];
  const approvalStatus = ["Approved", "Pending", "Rejected"];

  const dynamicData = Array.from({ length: 50 }, (_, i) => {
    const overtimeName = overtimeTypes[Math.floor(Math.random() * overtimeTypes.length)];
    const date = `2023-10-${String(Math.floor(Math.random() * 30) + 1).padStart(2, "0")}`;
    const totalHours = Math.floor(Math.random() * 5) + 1;
    const overtimePayroll = totalHours * 50000;
    const status = approvalStatus[Math.floor(Math.random() * approvalStatus.length)];

    return {
      id: i + 1,
      overtimeName,
      date,
      totalHours: totalHours.toString(),      
      overtimePayroll: overtimePayroll.toString(), 
      status                                  
    };
      });
      setData(dynamicData);
      setIsLoading(false);
    }

    fetchData();
  }, []);
  const { success, setSuccess } =useFormContext();
    useEffect(() => {
      if (success && Object.keys(success).length > 0) {
        toast.success(`${success.overtime}`);
        console.log(success);
        setSuccess({}); 
      }
    }, [success]); 

  return (
    <Sidebar title="Overtime">
      <Toaster position="bottom-right" expand={true} />
      {isLoading ? (
        <Skeleton className="rounded-[15px] w-full min-h-[230px] " />
      ) : (
        <div className=" bg-white rounded-[15px] p-5 flex flex-col gap-[10px]" id="overtime">
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
