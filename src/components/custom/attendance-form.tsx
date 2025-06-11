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
import Cookies from "js-cookie";
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
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface AttendanceFormProps {
  onClockInStatusChange: (clockedIn: boolean) => void;
}

const attendanceTypeOptions = [
  { label: "Clock In", value: "clockIn" },
  { label: "Annual Leave", value: "annualLeave" },
  { label: "Sick Leave", value: "sickLeave" },
];

const workTypeOptions = [
  { label: "WFO", value: "WFO" },
  { label: "WFA", value: "WFA" },
];

const formSchema = z
  .object({
    workType: z
      .string({ required_error: "Please select your work type." })
      .min(1, "Work Type is required"),
    attendanceType: z
      .string({ required_error: "Please choose your attendance type." })
      .min(1, "Attendance Type is required."),
    date: z
      .string({ required_error: "Please select a valid date range." })
      .optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    supportingEvidence: z
      .string({
        required_error: "Please upload supporting evidence.",
      })
      .optional(),
    check_clock_time: z.string({ required_error: "Clock time is required." }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.attendanceType === "annualLeave" ||
        data.attendanceType === "sickLeave") &&
      (!data.date || data.date.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        // message: "Date is required for annual or sick leave",
      });
    }

    const needsEvidence =
      data.workType === "WFA" ||
      data.attendanceType === "annualLeave" ||
      data.attendanceType === "sickLeave";

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

const AttendanceForm: React.FC<AttendanceFormProps> = ({ onClockInStatusChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
  });

  const [clockedIn, setClockedIn] = useState(false);
  const [valueEmployee, setValueEmployee] = useState("");
  const [valueWorkType, setValueWorkType] = useState("");
  const [valueAttendanceType, setValueAttendanceType] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();
  const [pinLocation, setPinLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { errors: contextErrors, setErrors, setSuccess } = useFormContext();

  const { locationRule } = useCKSettingData();

  const workType = watch("workType");
  const attendanceType = watch("attendanceType");

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

  // get user location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPinLocation({ lat: latitude, lng: longitude }); // Update pinLocation state
          },
          (error) => {
            console.error("Error fetching location:", error);
            toast.error(
              "Unable to fetch your location. Please enable location services."
            );
          }
        );
      } else {
        // console.error("Geolocation is not supported by this browser.");
        toast.error("Geolocation is not supported by your browser.");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (valueEmployee !== "")
      setValue("workType", "WFO", { shouldValidate: true });
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

  useEffect(() => {
    if (contextErrors && Object.keys(contextErrors).length > 0) {
      Object.entries(contextErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((message) => toast.error(`${message}`));
        } else {
          toast.error(`${messages}`);
        }
      });
      setErrors({});
    }
  }, [contextErrors]);

  // check clock in status
  useEffect(() => {
    const checkClockInStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/check-clockin`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token-employee")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check clock-in status");
        }

        const data = await response.json();

        if (data.clockedIn) {
          setClockedIn(true);
          onClockInStatusChange(true);
          // Set attendance type and work type if already clocked in
          setValue("attendanceType", "clockOut", {
            shouldValidate: true,
          });
          setValue("workType", data.workType, { shouldValidate: true });
          toast.info("You have already clocked in for today.");
        } else {
          setClockedIn(false);
          onClockInStatusChange(false);
        }
      } catch (error) {
        console.error("Error checking clock-in status:", error);
      }
    };

    checkClockInStatus();
  }, [setValue]);

  // server time extract
  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/server-time`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch server time");
        }
        const { serverTime } = await response.json();

        // Extract only the time portion (HH:mm) from the server time
        const time = new Date(serverTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour format
        });

        setValue("check_clock_time", time); // Assign only the time
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };

    fetchServerTime();
  }, [setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    console.log("time", data.check_clock_time);
    try {
      const formData = new FormData();

      const attendanceTypeMapping: Record<string, string> = {
        clockIn: "Present",
        clockOut: "Present",
        annualLeave: "Annual Leave",
        sickLeave: "Sick Leave",
      };

      formData.append("ck_setting_name", data.workType);
      formData.append("status", attendanceTypeMapping[data.attendanceType]);
      formData.append("check_clock_time", data.check_clock_time);

      formData.append(
        "check_clock_type",
        valueAttendanceType === "clockIn" ? "in" : "out"
      );

      const today = format(new Date(), "yyyy-MM-dd");
      formData.append("check_clock_date", today);

      if (
        (data.attendanceType === "annualLeave" ||
          data.attendanceType === "sickLeave") &&
        data.date
      ) {
        const [startDate, endDate] = data.date.split(" - ");
        formData.append("start_date", startDate); // Add start_date
        formData.append("end_date", endDate);
      }

      console.log(pinLocation?.lat, pinLocation?.lng);
      if (pinLocation) {
        formData.append("latitude", pinLocation.lat.toString());
        formData.append("longitude", pinLocation.lng.toString());
      }

      if (
        (data.workType === "WFA" ||
          data.attendanceType === "annualLeave" ||
          data.attendanceType === "sickLeave") &&
        uploadedFile
      ) {
        formData.append("evidence", uploadedFile);
      }

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/check-clock`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${Cookies.get("token-employee")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || "Failed to submit form.");
        return;
      }

      const result = await response.json();
      setSuccess(result.message);
      router.push("/checkclock");
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({ attendance: ["Something went wrong while submitting."] });
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("zod", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full p-5 gap-6 flex flex-col">
        <div className="flex flex-col gap-2" ref={fieldRefs.workType}>
          {errors.check_clock_time && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.check_clock_time?.message}
            </span>
          )}
          <Label>Work Type</Label>
          {clockedIn ? (
            <Input
              className="w-full bg-gray-100 cursor-not-allowed"
              value={workType}
              readOnly
            />
          ) : (
            <Select
              value={workType}
              onValueChange={(val) =>
                setValue("workType", val, { shouldValidate: true })
              }
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
          )}
          {errors.workType && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.workType?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2" ref={fieldRefs.attendanceType}>
          <Label>Attendance Type</Label>
          {attendanceType !== "clockOut" ? (
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

        {(valueAttendanceType === "annualLeave" ||
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

        {(workType === "WFA" ||
          valueAttendanceType === "annualLeave" ||
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
                  setUploadedFile(file);
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

        {valueAttendanceType !== "annualLeave" &&
          valueAttendanceType !== "sickLeave" && (
            <div className="w-full min-h-[400px] flex flex-col gap-2">
              <MapBoxMap
                officeLat={locationRule?.latitude}
                officeLng={locationRule?.longitude}
              />
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size={"small"} /> : "Submit"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AttendanceForm;
