"use client";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import { FormProvider } from "../components/context/FormContext";
import { FormProvider } from "@/components/context/FormContext";
import { EditProvider } from "../components/context/EditFormContext";
import { useEffect, useState } from "react";
import Joyride from "react-joyride";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { AuthProvider } from "@/context/AuthContext";
// import AuthGate from "@/components/custom/authGate";
// import {
//   BrowserRouter,
//   Navigate,
//   Route,
//   Router,
//   Routes,
// } from "react-router-dom";
// import PublicRoute from "@/components/PublicRoute";
// import Dashboard from "./dashboard/page";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import SignIn from "./sign-in/page";
// import SignInAsEmployee from "./sign-in/as-employee/page";
// import CheckEmail from "./sign-in/check-email/page";
// import ForgotPassword from "./sign-in/forgot-password/page";
// import LinkExpired from "./sign-in/link-expired/page";
// import SetNewPassword from "./sign-in/set-new-password/page";
// import SuccessSetPassword from "./sign-in/success-set-password/page";
// import SignUp from "./sign-up/page";
// import SignupCompleteForm from "@/components/custom/signupCompletion";
// import SignUpCompleteRegistration from "./sign-up/complete-registration/page";
// import Employee from "./employee/page";
// import OvertimeManagement from "./overtime/page";
// import CheckclockOverviewPage from "./checkclock/checkclock-management/page";
// import NotFound from "@/components/custom/NotFound";

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

  // contoh selain path luar
  // "overtime/add": [
  //   {
  //     target: "#overtime-add",
  //     content: "Welcome!! Please spare a minute to learn about our page",
  //     disableBeacon: true,
  //   },
  // ],
  // "checkclock/add": [
  //   {
  //     target: "#checkclock-add",
  //     content: "Welcome!! Please spare a minute to learn about our page",
  //     disableBeacon: true,
  //   },
  // ],
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
    // Determine the page key based on the current route
    const pageKey = pathname.replace("/", ""); // Remove leading slash and fallback to "default"

    // Update steps dynamically based on the current route
    setSteps(menuSteps[pageKey as keyof typeof menuSteps]);

    // Reset Joyride visibility for the current page
    checkJoyride(pageKey);

    // Update Joyride key to force re-render
    setJoyrideKey((prevKey) => prevKey + 1);
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {showJoyride && (
          <Joyride
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
        )}

        {/* <AuthProvider> */}
        {/* <AuthGate> */}
        <FormProvider>
          <EditProvider>{children}</EditProvider>
        </FormProvider>
        {/* </AuthGate> */}
        {/* </AuthProvider> */}

        {/* <AuthProvider>
          <FormProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<SignIn />}></Route>
                  <Route path="/sign-in" element={<SignIn />}></Route>
                  <Route
                    path="/sign-in/as-employee"
                    element={<SignInAsEmployee />}
                  ></Route>
                  <Route
                    path="/sign-in/check-email"
                    element={<CheckEmail />}
                  ></Route>
                  <Route
                    path="/sign-in/forgot-password"
                    element={<ForgotPassword />}
                  ></Route>
                  <Route
                    path="/sign-in/link-expired"
                    element={<LinkExpired />}
                  ></Route>
                  <Route
                    path="/sign-in/set-new-password"
                    element={<SetNewPassword />}
                  ></Route>
                  <Route
                    path="/sign-in/success-set-password"
                    element={<SuccessSetPassword />}
                  ></Route>
                  <Route path="/sign-up" element={<SignUp />}></Route>
                  <Route
                    path="/sign-up/complete-registration"
                    element={<SignUpCompleteRegistration />}
                  ></Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/employee" element={<Employee />} />
                  <Route path="/overtime" element={<OvertimeManagement />} />
                  <Route
                    path="/checkclock/checkclock-management"
                    element={<CheckclockOverviewPage />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FormProvider>
        </AuthProvider> */}
      </body>
    </html>
  );
}
