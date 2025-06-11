"use client";
import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
// import * as React from "react";
import AttendanceForm from "@/components/custom/attendance-form";
import { Toaster, toast } from "sonner";
import { useFormContext } from "@/components/context/FormContext";
import { useEffect, useState } from "react";

export default function AddCheckclockPage() {
  const { errors, success, setErrors, setSuccess } = useFormContext();

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message) => toast.error(`${message}`));
          console.log(`${messages}`);
        } else {
          // toast.error("Unknown error occured.");
        }
      });
      setErrors({});
    }
  }, [errors]);

  useEffect(() => {
    if (success && Object.keys(success).length > 0) {
      toast.success(`${success.message}`);
      setSuccess({});
    }
  }, [success]);

  const [valueEmployee, setValueEmployee] = useState("");

  return (
    <Sidebar title="Checkclock">
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        closeButton
      ></Toaster>
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
