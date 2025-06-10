"use client";
import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import AttendanceForm from "@/components/custom/attendance-form";

// type AddCheckClock = {
//   officeLat?: number;
//   officeLng?: number;
//   onPinReady?: (lat: number, lng: number) => void;
// };

export default function AddCheckclockPage() {
  const [valueEmployee, setValueEmployee] = React.useState("");

  return (
    <Sidebar title="Checkclock" >
     
      <Card>
        <CardContent className="flex flex-col gap-[15px]">
          <div className="px-[10px]">
            <h1 className="text-lg font-medium ">
              {valueEmployee === "" ? "Add Clock In" : "Add Clock Out"}
            </h1>
          </div>
          <AttendanceForm />
        </CardContent>
      </Card>
    </Sidebar>
  );
}
