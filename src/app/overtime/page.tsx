"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import * as React from "react";
import { OvertimeOverview, columns } from "./columns";
import { DataTable } from "./data-table";
import { useFormContext } from "@/components/context/FormContext";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";

export default function OvertimeOverviewPage() {
  const [data, setData] = useState<OvertimeOverview[]>([]);
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOvertime = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token-employee');

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/overtime`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw data;
        }
        // setOvertimeSettingData(data);
        console.log(data)
        setOvertimeData(data)
      } catch (err) {
        let message = "Unknown error occurred";
        let messagesToShow: string[] = [];

        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          typeof (err as any).message === "string"
        ) {
          const backendError = err as { message: string; errors?: Record<string, string[]> };

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
              <div key={idx} className="text-red-700">• {msg}</div>
            ))}
          </>,
          { duration: 30000 }
        );
      } finally {
        setLoading(false);
      }
    }
   fetchOvertime()
  }, [])
  return (
    <Sidebar title="Overtime">
      {/* <Toaster position="bottom-right" expand={true} /> */}
      {loading ? (
        <Skeleton className="rounded-[15px] w-full min-h-[230px] " />
      ) : (
        <div className=" bg-white rounded-[15px] p-5 flex flex-col gap-[10px]" id="overtime">
          <div className="container mx-auto">
            <DataTable columns={columns} data={overtimeData} />
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
