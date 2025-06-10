"use client";
import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import AttendanceForm from "@/components/custom/attendance-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/ui/fileUploader";
import { useRouter } from "next/navigation";
import OvertimeForm from "@/components/custom/overtime-form";

export default function AddOvertimePaymentPage() {
  const [valueEmployee, setValueEmployee] = React.useState("");
  const [date, setDate] = React.useState<Date>();
  const router = useRouter();
  const handleSave = () => {
    console.log("Data berhasil disimpan!");
  };

  // Simulasikan ada data clock in
  // React.useEffect(() => {
  //   // Simulasikan pengisian data employee setelah 2 detik
  //   setTimeout(() => {
  //     setValueEmployee(clockIn=> "08:00");
  //   });
  // }, []);

  return (
    <Sidebar title="Overtime">
      <Card id="overtime-add">
        <CardContent className="flex flex-col gap-[15px]">
          <div className="px-[10px]">
            <h1 className="text-lg font-medium ">
              Add Overtime Payment Submisson
            </h1>
          </div>
         <OvertimeForm></OvertimeForm>
        </CardContent>
      </Card>
    </Sidebar>
  );
}
