"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "@/components/context/FormContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import MapBoxMap from "@/components/ui/map";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";
import { FileUploader } from "../ui/fileUploader";
import { useCKSettingData } from "@/hooks/useCheckClockData";

const attendanceTypeOptions = [
  { label: "Clock In", value: "clockIn" },
  { label: "Anual Leave", value: "anualLeave" },
  { label: "Sick Leave", value: "sickLeave" },
];

const workTypeOptions = [
  { label: "WFO", value: "wfo" },
  { label: "WFA", value: "wfa" },
];

const formSchema = z
  .object({
    workType: z
      .string({ required_error: "Please select your work type." })
      .min(1, "Work Type is required"),
    attendanceType: z
      .string({ required_error: "Please choose your attendance type." })
      .min(1, "Attendance Type is required."),
    date: z.string({ required_error: "Please select a valid date range." }),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    supportingEvidence: z.string({
      required_error: "Please upload supporting evidence.",
    }),
  })
  .superRefine((data, ctx) => {
    const needsEvidence =
      data.workType === "wfa" ||
      data.attendanceType === "anualLeave" ||
      data.attendanceType === "sickLeave";

    if (
      (data.attendanceType === "anualLeave" ||
        data.attendanceType === "sickLeave") &&
      (!data.date || data.date.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        // message: "Date is required for annual or sick leave",
      });
    }

    if (
      needsEvidence &&
      (!data.supportingEvidence || data.supportingEvidence.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["supportingEvidence"],
        // message: "Supporting evidence is required for WFA or leave types",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const AttendanceForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [valueEmployee, setValueEmployee] = useState("");
  const [valueWorkType, setValueWorkType] = useState("");
  const [valueAttendanceType, setValueAttendanceType] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const router = useRouter();
  const [pinLocation, setPinLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { setErrors, setSuccess } = useFormContext();

  const {locationRule} = useCKSettingData();

  console.log(locationRule);
  console.log(locationRule?.latitude, locationRule?.longitude);

  const fieldRefs = {
    workType: useRef<HTMLDivElement>(null),
    attendanceType: useRef<HTMLDivElement>(null),
    date: useRef<HTMLDivElement>(null),
    supportingEvidence: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0] as keyof typeof fieldRefs;
    if (firstErrorField && fieldRefs[firstErrorField]?.current) {
      fieldRefs[firstErrorField]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const inputEl = fieldRefs[firstErrorField]?.current?.querySelector(
        "input, select, button"
      ) as HTMLElement;
      if (inputEl) inputEl.focus();
    }
  }, [errors]);

  useEffect(() => {
    if (valueEmployee !== "")
      setValue("workType", "wfo", { shouldValidate: true });
  }, [valueEmployee, setValue]);

  useEffect(() => {
    if (valueEmployee !== "")
      setValue("attendanceType", "clockOut", { shouldValidate: true });
  }, [valueEmployee, setValue]);

  useEffect(() => {
    if (date?.from && date?.to) {
      const formatted = `${format(date.from, "yyyy-MM-dd")} - ${format(
        date.to,
        "yyyy-MM-dd"
      )}`;
      setValue("date", formatted, { shouldValidate: true });
    }
  }, [date, setValue]);

  const handlePinReady = (lat: number, lng: number) => {
    setPinLocation({ lat, lng });
  };

  // const handleSave = () => {
  //   console.log("Data berhasil disimpan!");
  //   setSuccess({ attendance: ["Attendance submitted successfully!"] });
  //   router.push("/checkclock");
  // };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted successfully:", data);
    setSuccess({ attendance: ["Attendance submitted successfully!"] });
    // setSuccess({ attendance: ["Attendance submitted successfully!"] });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full p-5 gap-6 flex flex-col">
        <div className="flex flex-col gap-2" ref={fieldRefs.workType}>
          <Label>Work Type</Label>
          {valueEmployee === "" ? (
            <Select
              value={valueWorkType}
              onValueChange={(val) => {
                setValueWorkType(val);
                setValue("workType", val, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                {workTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              className="w-full bg-gray-100 cursor-not-allowed"
              value="WFO"
              readOnly
            />
          )}
          {errors.workType && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.workType?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2" ref={fieldRefs.attendanceType}>
          <Label>Attendance Type</Label>
          {valueEmployee === "" ? (
            <Select
              value={valueAttendanceType}
              onValueChange={(val) => {
                setValueAttendanceType(val);
                setValue("attendanceType", val, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select attendance type" />
              </SelectTrigger>
              <SelectContent>
                {attendanceTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              className="w-full bg-gray-100 cursor-not-allowed"
              value="Clock Out"
              readOnly
            />
          )}
          {errors.attendanceType && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.attendanceType.message}
            </span>
          )}
        </div>

        {(valueAttendanceType === "anualLeave" ||
          valueAttendanceType === "sickLeave") && (
          <div className="flex flex-col gap-2" ref={fieldRefs.date}>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="calendar"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date?.from && date?.to
                    ? `${format(date.from, "dd/MM/yyyy")} - ${format(
                        date.to,
                        "dd/MM/yyyy"
                      )}`
                    : "Pick a date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white z-50"
                align="start"
              >
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.date.message}
              </span>
            )}
          </div>
        )}

        {(valueWorkType === "wfa" ||
          valueAttendanceType === "anualLeave" ||
          valueAttendanceType === "sickLeave") && (
          <div
            className="flex flex-col gap-2"
            ref={fieldRefs.supportingEvidence}
          >
            <Label>Upload Supporting Evidence</Label>
            <FileUploader
              onDrop={(files) => {
                const file = files[0];
                if (file) {
                  setValue("supportingEvidence", file.name, {
                    shouldValidate: true,
                  });
                }
              }}
              accept={{ "image/png": [], "image/jpeg": [], "image/jpg": [] }}
              type="Only support .png, .jpg, .jpeg"
            />
            {errors.supportingEvidence && (
              <span className="text-red-500 text-sm font-semibold">
                {errors.supportingEvidence.message}
              </span>
            )}
          </div>
        )}

        {valueAttendanceType !== "anualLeave" &&
          valueAttendanceType !== "sickLeave" && (
            <div className="w-full min-h-[400px] flex flex-col gap-2">
              <MapBoxMap officeLat={locationRule?.latitude} officeLng={locationRule?.longitude} />
            
            </div>
          )}
      </Card>

      <div className="flex w-full gap-[15px] justify-end mt-6">
        <div className="w-[93px]">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
        <div className="w-[93px]">
          <Button type="submit" 
          // onClick={handleSave}
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AttendanceForm;
