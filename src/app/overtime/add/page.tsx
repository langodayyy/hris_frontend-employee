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
      <Card>
        <CardContent className="flex flex-col gap-[15px]">
          <div className="px-[10px]">
            <h1 className="text-lg font-medium ">
              Add Overtime Payment Submisson
            </h1>
          </div>
          <form action="">
            <Card className="w-full p-5 gap-6 flex flex-col">
              <div className="flex gap-6">
                <div className="flex flex-col gap-2 w-full">
                  <Label>Overtime Date</Label>
                  <div className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"calendar"}
                          className={cn(
                            "w-full justify-start text-left font-normal py-3",
                            !date && "text-neutral-300"
                          )}
                        >
                          <CalendarIcon />
                          {date ? format(date, "PPP") : <span>dd/mm/yyyy</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label>Total Hours</Label>
                  <Input
                    type="number"
                    className="no-spinner"
                    placeholder="Enter overtime duration"
                  ></Input>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Upload Supporting Evidence</Label>
                <FileUploader
                  onDrop={(files) => {
                    const file = files[0];
                    if (file) {
                    }
                  }}
                  accept={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                  }}
                  type="Only support .png, .jpg, .jpeg"
                />
              </div>
            </Card>
            <div className="flex w-full gap-[15px] justify-end mt-6">
              <div className="w-[93px]">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
              <div className="w-[93px]">
                <Button type="submit" onClick={handleSave}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </Sidebar>
  );
}
