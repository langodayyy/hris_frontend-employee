"use client";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import { FormProvider } from "../components/context/FormContext";
import { FormProvider } from "@/components/context/FormContext";
import { EditProvider } from "../components/context/EditFormContext";
import { useEffect, useRef, useState } from "react";
import Joyride from "react-joyride";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic"; // Import dynamic

// Dynamically import Joyride with SSR disabled
const DynamicJoyride = dynamic(() => import("react-joyride"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const menuSteps = {
  dashboard: [
    {
      target: "#sidebar",
      content:
        "This is your main navigation sidebar. You can access different menu of HRIS here.",
      disableBeacon: true,
      placement: "right" as const,
    },
    {
      target: "#nav-search-bar",
      content: "Here you can search for anything you need in the HRIS system.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#notification",
      content:
        "This section shows important notifications for you. Like approval and your attendance information.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#profile",
      content:
        "Click here to view or edit your profile, including your name, employee ID, and other account settings..",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#period-selection",
      content:
        "Use this dropdown to select the month and year for the data displayed on the dashboard.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#dashboard-cards",
      content:
        "These cards provide a quick overview of key metrics like total work hours, on-time attendance, and absences.",
      disableBeacon: true,
    },
    {
      target: "#work-hours-chart",
      content:
        "This chart visualizes your daily work hours for the selected period.",
      disableBeacon: true,
    },
    {
      target: "#attendance-summary",
      content:
        "View your attendance summary, including present, leave, and absent days.",
      disableBeacon: true,
      placement: "right" as const,
    },
    {
      target: "#leave-summary",
      content:
        "Check your annual leave quota, taken days, and remaining leave.",
      disableBeacon: true,
      placement: "left" as const,
    },
    {
      target: "#expected-salary",
      content:
        "This section shows your expected monthly salary and payroll details.",
      disableBeacon: true,
      placement: "right" as const,
    },
    {
      target: "#overtime-summary",
      content: "Keep track of your overtime hours for the current month.",
      disableBeacon: true,
      placement: "left" as const,
    },
  ],
  checkclock: [
    {
      target: "#checkclock",
      content:
        "This table shows a summary of your daily attendance. You can see clock in/out times, status, work type (WFO/WFA), work hours, and approval status.",
      disableBeacon: true,
    },
    {
      target: "#checkclock-date-filter",
      content:
        "Use this date filter to view Checkclock data for a specific day or date range.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#checkclock-filter",
      content:
        "filter your checkclock data based on attendance status and approval status",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#checkclock-add",
      content: "Use this button to record your attendance at work.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
  ],
  overtime: [
    {
      target: "#overtime",
      content:
        "This table displays a list of overtime that you have done, complete with information on the date, total duration of overtime, and approval status.",
      disableBeacon: true,
    },
    {
      target: "#overtime-date-filter",
      content:
        "Use this date filter to view your overtime data for a specific day or date range.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#overtime-filter",
      content: "filter your overtime data based on approval status or overtime name",
      disableBeacon: true,
      placement: "bottom" as const,
    },
    {
      target: "#overtime-add",
      content: "Use this button to record your attendance at work.",
      disableBeacon: true,
      placement: "bottom" as const,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [steps, setSteps] = useState(menuSteps.dashboard);
  const [joyrideKey, setJoyrideKey] = useState(0);
  const [showJoyride, setShowJoyride] = useState(false);
  const pathname = usePathname();
  const mounted = useRef(false);

  const checkJoyride = (pageKey: string) => {
    const hasSeenJoyride = localStorage.getItem(`hasSeenJoyride_${pageKey}`);

    if (!hasSeenJoyride) {
      setShowJoyride(true);
      localStorage.setItem(`hasSeenJoyride_${pageKey}`, "true");
    } else {
      setShowJoyride(false);
    }
  };

  useEffect(() => {
    mounted.current = true; // Set mounted to true when component mounts

    const pageKey = pathname.replace("/", "");
    const selectedSteps = menuSteps[pageKey as keyof typeof menuSteps] || [];

    // Only update state if component is still mounted
    if (mounted.current) {
      setSteps(selectedSteps);
      checkJoyride(pageKey);
      setJoyrideKey((prevKey) => prevKey + 1);
    }

    return () => {
      mounted.current = false; // Set mounted to false when component unmounts
    };
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* {showJoyride && (
          <DynamicJoyride
            key={joyrideKey}
            steps={steps}
            continuous={true}
            showProgress
            showSkipButton
            disableScrolling
            styles={{
              options: {
                arrowColor: "#fff",
                backgroundColor: "#fff",
                primaryColor: "#1E3A5F",
                zIndex: 10000,
              },
              tooltip: {
                borderRadius: "12px",
                padding: "16px",
                fontSize: "16px",
                boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
                height: "fit-content",
              },

              buttonBack: {
                marginRight: 5,
                color: "#1E3A5F",
                border: "1px solid #1E3A5F",
                backgroundColor: "#fff",
                borderRadius: "5px"
              },
              buttonClose: {
                display: "none", 
              },
            }}
          />
        )} */}

        <FormProvider>
          <EditProvider>{children}</EditProvider>
        </FormProvider>
      </body>
    </html>
  );
}
