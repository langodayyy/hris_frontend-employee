"use client";
import Sidebar from "@/components/sidebar";
import PersonalInformation from "./personal-information";
import ContactInformation from "./contact-information";
import EmploymentOverview from "./employment-overview";
import EmployeeDocuments from "./documents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { EmployeeResponse } from "@/types/employee";
import { Spinner } from "@/components/ui/spinner";
import Cookies from "js-cookie";
import React from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import PasswordInput from "@/components/ui/passwordInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfilData } from "@/hooks/useProfileData";
import { Employee } from "@/types/employee";

export default function EmployeeDetails() {
  const { employeeData, loading, error } = useProfilData();
  console.log("Employee Data:", employeeData);

  type Props = {
    employeeData?: Employee;
  };
  // Pastikan state password selalu string kosong, bukan undefined/null
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async () => {
    // setLoading(true);

    const form = document.getElementById("passwordForm") as HTMLFormElement;
    const formData = new FormData(form);

    // Tambahkan _method agar Laravel tahu bahwa ini PATCH
    formData.append("_method", "PATCH");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/change-password`,
        {
          method: "PATCH", // Tetap pakai POST karena pakai _method
          headers: {
            Authorization: `Bearer ${Cookies.get("token-employee")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_password: oldPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      // toast.success("Password successfully updated");
      // setShowChangePasswordDialog(false);
    } catch (err) {
      let message = "Unknown error occurred";
      let messagesToShow: string[] = [];

      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        const backendError = err as {
          message: string;
          errors?: Record<string, string[]>;
        };

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

      // toast.error(
      //   <>
      //     <p className="text-red-700 font-bold">Error</p>
      //     {messagesToShow.map((msg, idx) => (
      //       <div key={idx} className="text-red-700">
      //         • {msg}
      //       </div>
      //     ))}
      //   </>,
      //   { duration: 30000 }
      // );
    }
    // finally {
    //   setLoading(false);
    // }
  };

  // const [employeeStatus, setEmployeeStatus] = useState("");
  // const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // const inputFileRef = useRef<HTMLInputElement>(null);
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setAvatarPreview(URL.createObjectURL(file));
  //   }
  // };

  // const handleEditPhotoClick = () => {
  //   inputFileRef.current?.click();
  // };
  // const handleCancelPhotoClick = () => {
  //   setAvatarPreview(null); // reset preview foto
  //   if (inputFileRef.current) {
  //     inputFileRef.current.value = ""; // reset input file supaya kosong
  //   }
  // };
  // const [loadingPhoto, setLoadingPhoto] = useState(false);
  // const [successPhoto, setSuccessPhoto] = useState(false);
  // const [errorPhoto, setErrorPhoto] = useState(false);
  // const handleSavePhotoCLick = async () => {
  //   setLoadingPhoto(true);
  //   setErrorPhoto(false);
  //   setSuccessPhoto(false);

  //   try {
  //     const formData = new FormData();

  //     const file = inputFileRef.current?.files?.[0];
  //     if (file) {
  //       formData.append("employee_photo", file);
  //     }

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeData?.employee.employee_id}?_method=PATCH`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("token-employee")}`,
  //           // Jangan tambahkan Content-Type manual di sini!
  //         },
  //         body: formData,
  //       }
  //     );

  //     const responseData = await response.json();
  //     console.log("Response:", responseData);

  //     if (!response.ok) throw new Error("Gagal submit");

  //     setSuccessPhoto(true);
  //     fetchData();
  //     setAvatarPreview(null);
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     setErrorPhoto(true);
  //   } finally {
  //     setLoadingPhoto(false);
  //   }
  // };
  // const [isDialogAOpen, setDialogAOpen] = useState(false);
  // const handleOkClick = async () => {
  //   // panggil fetchData()
  //   setDialogAOpen(false);
  //   setSuccess(false); // reset state jika perlu
  // };
  // // const [isDialogOpen, setIsDialogOpen] = useState(false);

  // // const handleChangeStatus = () => {
  // //     setIsDialogOpen(true);
  // // };
  // const params = useParams();
  // const id = params.id;
  // const [employeeData, setEmployeeData] = useState<
  //   EmployeeResponse | undefined
  // >(undefined);
  // const [isLoading, setIsLoading] = useState(true);
  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("token-employee")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!res.ok) throw new Error("Failed to fetch employee");

  //     const data: EmployeeResponse = await res.json();
  //     setEmployeeData(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  // const [error, setError] = useState(false);

  // const handleExportButton = async () => {
  //   setLoading(true);
  //   setError(false);
  //   setSuccess(false);

  //   try {
  //     const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/employee/export-csv`;
  //     const params = new URLSearchParams();

  //     if (employeeData?.employee.employee_id) {
  //       params.append("employee_id", employeeData?.employee.employee_id);
  //       const url = params.toString()
  //         ? `${baseUrl}?${params.toString()}`
  //         : baseUrl;

  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("token-employee")}`,
  //         },
  //       });

  //       if (!response.ok) throw new Error("Gagal mengunduh file");

  //       const blob = await response.blob();
  //       const downloadUrl = window.URL.createObjectURL(blob);

  //       const a = document.createElement("a");
  //       a.href = downloadUrl;
  //       a.download = "employees.csv";
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //       window.URL.revokeObjectURL(downloadUrl);

  //       // setSuccess(true);
  //     }
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleSubmitForm = async () => {
  //   setLoading(true);
  //   setError(false);
  //   setSuccess(false);

  //   try {
  //     const form = document.getElementById("employeeForm") as HTMLFormElement;
  //     const formData = new FormData(form);

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeData?.employee.employee_id}?_method=PATCH`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("token-employee")}`,
  //           // Jangan tambahkan Content-Type manual di sini!
  //         },
  //         body: formData,
  //       }
  //     );

  //     const responseData = await response.json();
  //     console.log("Response:", responseData);

  //     if (!response.ok) throw new Error("Gagal submit");

  //     setSuccess(true);
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const resetEmployeePassword = async () => {
  //   setLoading(true);
  //   setError(false);
  //   setSuccess(false);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeData?.employee.employee_id}/reset-password`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("token-employee")}`,
  //           // Jangan tambahkan Content-Type manual di sini!
  //         },
  //       }
  //     );

  //     const responseData = await response.json();
  //     console.log("Response:", responseData);

  //     if (!response.ok) throw new Error("Gagal submit");

  //     setSuccess(true);
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const router = useRouter();
  // // const deleteEmployee = async () => {
  // //     setLoading(true);
  // //     setError(false);
  // //     setSuccess(false);
  // //     try {

  // //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeData?.employee.employee_id}`, {
  // //                 method: "DELETE",
  // //                 headers: {
  // //                     "Authorization": `Bearer ${Cookies.get("token")}`,
  // //                     // Jangan tambahkan Content-Type manual di sini!
  // //                 },
  // //         });

  // //         const responseData = await response.json();
  // //         console.log("Response:", responseData);

  // //         if (!response.ok) throw new Error("Gagal submit");

  // //         setSuccess(true);
  // //     } catch (err) {
  // //         console.error("Submit error:", err);
  // //         setError(true);
  // //     } finally {
  // //         setLoading(false);
  // //     }
  // // };

  // // const [isDialogEmployeeStatusOpen, setDialogEmployeeStatusOpen] = useState(false);
  // // const [isDialogResetPasswordOpen, setDialogResetPasswordOpen] = useState(false);
  // // const [isDialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  // // const [confirmationText, setConfirmationText] = useState("");

  // // const handleOkClickEmployeeStatus = async () => {
  // //     fetchData()
  // //     setDialogEmployeeStatusOpen(false)
  // //     setSuccess(false);

  // // };
  // // const handleOkClickResetPassword = async () => {
  // //     setDialogResetPasswordOpen(false)
  // //     setSuccess(false);

  // // };
  // // const handleOkClickDelete = async () => {
  // //     setDialogDeleteOpen(false)
  // //     setSuccess(false);
  // //     router.push("/employee");

  // // };
  // // const handleChangeStatus = () => {
  // //     setDialogEmployeeStatusOpen(true);
  // // };

  // // const handleResetPassword = () => {
  // //     setDialogResetPasswordOpen(true)
  // // }
  // // const handleDelete = () => {
  // //     setDialogDeleteOpen(true)
  // // }

  // icon & change password state
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  // Password Change Handlers
  const handleOpenChangePasswordDialog = useCallback(() => {
    setIsHeaderDropdownOpen(false);
    setShowChangePasswordDialog(true);
  }, []);

  // const handleChangePasswordSubmit = useCallback(() => {
  //   // Implement password change logic here (e.g., API call)
  //   console.log("Password changed!");
  //   setShowChangePasswordDialog(false);
  // }, []);

  return (
    <Sidebar title="Profile">
      <div className="flex flex-col gap-[30px]">
        {/* {isLoading ? (
          
          <>
            <Skeleton className="rounded-[15px] w-full min-h-[230px]" />
            <Skeleton className="rounded-[15px] w-full min-h-[230px]" />
          </>
        ) : (" ")} */}
        <div>
          <Card className="flex-1 gap-[15px] rounded-[15px] border border-black/15 bg-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex mx-[20px] items-center justify-between">
              <div className="flex flex-row items-center">
                <div className="relative w-[78px] h-[78px]">
                  {/* {avatarPreview || employeeData?.employee_photo_url ? (
                      <img
                        src={
                          avatarPreview ??
                          employeeData?.employee_photo_url ??
                          ""
                        }
                        alt="Employee Photo"
                        className="w-[78px] h-[78px] rounded-full object-cover bg-gray-200"
                      />
                    ) :  ("" )} */}
                  <svg
                    width="78"
                    height="78"
                    viewBox="0 0 78 78"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="78" height="78" rx="39" fill="#F3F4F6" />
                    <mask
                      id="mask0_462_2363"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="16"
                      width="78"
                      height="62"
                      mask-type="alpha"
                    >
                      <path
                        d="M78 68.2272V78H0V68.263C4.53684 62.1999 10.4257 57.2791 17.1983 53.8916C23.9709 50.5042 31.4405 48.7436 39.013 48.75C54.951 48.75 69.108 56.4005 78 68.2272V68.2272ZM52.0065 29.2467C52.0065 32.6945 50.6369 36.0011 48.1989 38.4391C45.7609 40.8771 42.4543 42.2467 39.0065 42.2467C35.5587 42.2467 32.2521 40.8771 29.8141 38.4391C27.3761 36.0011 26.0065 32.6945 26.0065 29.2467C26.0065 25.7989 27.3761 22.4923 29.8141 20.0543C32.2521 17.6163 35.5587 16.2467 39.0065 16.2467C42.4543 16.2467 45.7609 17.6163 48.1989 20.0543C50.6369 22.4923 52.0065 25.7989 52.0065 29.2467V29.2467Z"
                        fill="black"
                      />
                    </mask>
                    <g mask="url(#mask0_462_2363)">
                      <rect width="78" height="78" rx="39" fill="#D1D5DB" />
                    </g>
                  </svg>

                  {/* Tombol edit kecil di pojok kanan bawah */}
                  <button
                    // onClick={handleEditPhotoClick}
                    type="button"
                    className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100 shadow-md"
                    aria-label="Edit photo"
                  >
                    <svg
                      className="!w-[12px] !h-[12px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 20H21"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Input file tersembunyi */}
                <input
                  type="file"
                  name="employee_photo"
                  accept="image/*"
                  id="employee_photo"
                  className="hidden"
                  // ref={inputFileRef}
                  // onChange={handleFileChange}
                />
                <div className="flex flex-col ml-[15px] gap-[10px]">
                  {/* {avatarPreview && (
                      <>
                        <Button
                          disabled={loadingPhoto}
                          onClick={handleSavePhotoCLick}
                          variant={"default"}
                          size={"sm"}
                        >
                          {!loadingPhoto ? (
                            <span className="ml-1">Save</span>
                          ) : (
                            <Spinner size="small" />
                          )}
                        </Button>
                        <Button
                          disabled={loadingPhoto}
                          onClick={handleCancelPhotoClick}
                          variant={"secondary"}
                          size={"sm"}
                        >
                          {!loadingPhoto ? (
                            <span className="ml-1">Cancel</span>
                          ) : (
                            <Spinner size="small" />
                          )}
                        </Button>
                      </>
                    )} */}
                </div>

                <div className="flex flex-col ml-[15px] gap-[10px]">
                  <p className="font-medium text-base text-black">
                    {employeeData?.first_name} {employeeData?.last_name}
                  </p>
                  <p className="font-normal text-base text-black/52">
                    {employeeData?.employee_id}
                  </p>
                </div>
                <div className="flex gap-[20px] ml-auto items-center"></div>
              </div>
              {/* Header Profile Dropdown */}
              <DropdownMenu
              // open={isHeaderDropdownOpen}
              // onOpenChange={setIsHeaderDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-fit h-fit"
                    icon={
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  ></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit h-fit">
                  <DropdownMenuItem
                    className="w-full h-fit cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleOpenChangePasswordDialog();
                    }}
                  >
                    Change password
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Change Password Dialog */}
              <Dialog
                open={showChangePasswordDialog}
                onOpenChange={setShowChangePasswordDialog}
              >
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 mt-3">
                    <form id="passwordForm">
                      <PasswordInput
                        label="Old Password"
                        name="currentPassword"
                        id="currentPassword"
                        placeholder="Enter your old password"
                      />
                      <PasswordInput
                        label="New Password"
                        name="newPassword"
                        id="newPassword"
                        placeholder="Enter your new password"
                      />
                      <PasswordInput
                        label="Confirmation New Password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Enter your new password again"
                      />
                    </form>
                  </div>
                  <DialogFooter>
                    <div className="flex flex-row gap-3.5 justify-end mt-4">
                      <DialogClose asChild>
                        <Button variant={"outline"} className="w-fit">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant={"default"}
                        className="w-fit h-fit"
                        onClick={changePassword}
                      >
                        Save
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-[15px]">
              <div className="w-6/10">
                <PersonalInformation
                  employeeData={employeeData ?? undefined}
                  // onUpdate={fetchData}
                ></PersonalInformation>
              </div>
              <div className="flex flex-col w-4/10 gap-[15px]">
                <ContactInformation
                  employeeData={employeeData ?? undefined}
                  // onUpdate={fetchData}
                ></ContactInformation>
                <EmploymentOverview
                  employeeData={employeeData ?? undefined}
                  // onUpdate={fetchData}
                ></EmploymentOverview>
              </div>
            </div>
          </Card>
        </div>

        {/* </Card> */}
        <EmployeeDocuments></EmployeeDocuments>
      </div>
    </Sidebar>
  );
}
