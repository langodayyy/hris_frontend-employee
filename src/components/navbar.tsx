"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import SearchBar from "./ui/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Cookies from "js-cookie";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
   const [imageValid, setImageValid] = useState(true);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);

  // Fungsi untuk mengambil inisial dari nama pengguna
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();
  };

  //sugestion searchbar
  const result = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Checkclock", path: "/checkclock" },
    { label: "Add Checkclock", path: "/checkclock/add" },
    { label: "Overtime", path: "/overtime" },
    { label: "Add Overtime", path: "/overtime/add" },
    { label: "Profile", path: "/profile" },
  ];

  // array notification sample
  const notifications = [
    {
      user_id: 3,
      type: "checkclock",
      time: "5 minutes ago",
      approval_status: "approved",
    },
    {
      user_id: 3,
      type: "checkclock",
      time: "10 minutes ago",
      approval_status: "rejected",
    },
    {
      user_id: 3,
      type: "overtime",
      time: "1 hour ago",
      approval_status: "approved",
    },
    {
      user_id: 3,
      type: "overtime",
      time: "2 hours ago",
      approval_status: "rejected",
    },
  ];

  const notificationCount = notifications.length;

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token-employee');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-user-employee`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw data;
        }
        setAvatarImage(data.photo_url);
        setUserName(data.full_name);
        setCompany(data.company_name);
        setEmployeeId(data.id_employee)

      } catch (err) {
      
      }
    };
    fetchUser();
  }, [])

  const handleLogout = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout-employee`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token-employee")}`,
                    // Jangan tambahkan Content-Type manual di sini!
                },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw responseData; 
        }
        Cookies.remove("token-employee");
        // router.replace("/sign-in");
        window.location.href = `${process.env.NEXT_PUBLIC_MAIN_URL}/sign-in`
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
        messagesToShow = [message]
        }

        // toast.error(
        //     <>
        //         <p className="text-red-700 font-bold">Error</p>
        //         {messagesToShow.map((msg, idx) => (
        //         <div key={idx} className="text-red-700">• {msg}</div>
        //         ))}
        //     </>,
        //     { duration: 30000 }
        // );
    } finally {

    }
  };

  return (
    <nav className="sticky z-50 top-0 flex-row items-center h-auto bg-white px-6 py-[16px] justify-between shadow-[0px_2px_4px_#B0B0B0] grid grid-cols-3">
      <div className="flex w-full justify-start h-[29px]">
        <a href="#" className="text-2xl font-medium focus:outline-nonext-left">
          {title}
        </a>
      </div>
      <div className="flex flex-row items-center justify-center w-full h-[36px] gap-[12px] relative">
        <SearchBar results={result} />
      </div>

      {/* notification */}
      <div className="flex flex-row gap-[24px] w-auto h-auto justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative flex items-center" id="notification">
              <div className="relative ">
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="24"
                    viewBox="0 0 23 24"
                    fill="none"
                  >
                    <path
                      d="M11.5189 2.823C7.99228 2.823 5.13645 5.67883 5.13645 9.2055V11.218C5.13645 11.8697 4.86811 12.8472 4.5327 13.403L3.31561 15.4347C2.56811 16.6901 3.08561 18.0892 4.46561 18.5492C9.04645 20.073 14.001 20.073 18.5819 18.5492C19.8756 18.118 20.4314 16.6038 19.7319 15.4347L18.5148 13.403C18.1794 12.8472 17.911 11.8601 17.911 11.218V9.2055C17.9014 5.698 15.0264 2.823 11.5189 2.823Z"
                      stroke="#444750"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.6916 18.942C14.6916 20.6958 13.2541 22.1333 11.5003 22.1333C10.6282 22.1333 9.82325 21.7691 9.24825 21.1941C8.67325 20.6191 8.30908 19.8141 8.30908 18.942"
                      stroke="#444750"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                  </svg>
                </a>
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-[16px] h-[16px] bg-red-600 text-white text-xs rounded-full">
                    {notificationCount}
                  </span>
                )}
              </div>
            </div>
            {/* notification dropdown */}
            <DropdownMenuContent className="absolute w-[300px] p-0 top-3 right-0 max-h-[480px] overflow-y-auto">
              <DropdownMenuLabel className="bg-neutral-50 text-neutral-900 h-[42px] px-4 py-[10px] text-base items-center">
                Notification
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="m-0" />
              {notificationCount > 0 ? (
                notifications.map((notification, index) => (
                  <DropdownMenuItem key={index} className="h-[91px]">
                    <div className="flex items-center flex-row gap-[10px] w-auto h-[91px] py-3">
                      <Image
                        src={`/${notification.type}-${notification.approval_status}.svg`} // Corrected dynamic image source
                        alt="status-icon"
                        width={53}
                        height={53}
                      />

                      <div className="flex flex-col gap-[2px] h-auto w-full">
                        <div className="flex flex-col">
                          <span className="text-base font-medium text-neutral-950">
                            HR has {notification.approval_status} your{" "}
                            {notification.type} request
                          </span>
                        </div>
                        <span className="text-sm text-info-500">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="h-[50px] flex items-center justify-center text-neutral-500">
                  No new notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* user dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className="flex flex-row gap-3 w-full h-full rounded-full cursor-pointer transition duration-15 hover:bg-gray-100"
              id="profile"
            >
              <div className="relative flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full">
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {userName}
                  </span>
                )}
              </div>
              <div className="flex flex-col h-auto w-auto">
                <span className="text-base font-medium text-neutral-950">
                  {userName && userName.length > 20
                    ? `${userName.slice(0, 20)}...`
                    : userName || "Loading..."}
                </span>
                <span className="text-sm text-start ext-neutral-500">
                  {employeeId}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[230px] absolute top-3 -right-20 p-3">
            <DropdownMenuLabel>
              <div className="flex justify-center items-center flex-col w-auto gap-2">
                <div className="relative flex items-center justify-center w-15 h-15 bg-gray-400 rounded-full">
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {userName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base font-medium text-neutral-900 text-center">
                    Hello, {userName}
                  </span>
                  <span className="text-sm text-neutral-500">ID : {employeeId}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = "/profile")}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
