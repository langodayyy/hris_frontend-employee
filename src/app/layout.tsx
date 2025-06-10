"use client";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import { FormProvider } from "../components/context/FormContext";
import { FormProvider } from "@/components/context/FormContext";
import { EditProvider } from "../components/context/EditFormContext";
import Joyride from "react-joyride";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
      content: "Welcome!! Please spare a minute to learn about our page",
      disableBeacon: true,
    },
    {
      target: "#navbar",
      content: "You can log in here",
      disableBeacon: true,
    },
  ],
  checkclock: [
    {
      target: "#checkclock",
      content: "Welcome!! Please spare a minute to learn about our page",
      disableBeacon: true,
    },
  ],
  overtime: [
    {
      target: "#overtime",
      content: "Welcome!! Please spare a minute to learn about our page",
      disableBeacon: true,
    },
  ],
  // contoh selain path luar
  "overtime/add": [
    {
      target: "#overtime-add",
      content: "Welcome!! Please spare a minute to learn about our page",
      disableBeacon: true,
    },
  ],
  "checkclock/add": [
    {
      target: "#checkclock-add",
      content: "Welcome!! Please spare a minute to learn about our page",
      disableBeacon: true,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [steps, setSteps] = useState(menuSteps.dashboard); // State to manage steps
  const [joyrideKey, setJoyrideKey] = useState(0); // Key to force Joyride re-render
  const [showJoyride, setShowJoyride] = useState(false); // State to control Joyride visibility
  const pathname = usePathname();

  const checkJoyride = (pageKey: string) => {
    const hasSeenJoyride = localStorage.getItem(`hasSeenJoyride_${pageKey}`);

    if (!hasSeenJoyride) {
      // Show Joyride for the first-time user on this page
      setShowJoyride(true);
      localStorage.setItem(`hasSeenJoyride_${pageKey}`, "true"); // Set the flag for this page
    } else {
      // Skip Joyride for subsequent visits to this page
      setShowJoyride(false);
    }
  };

  // useEffect(() => {
  //   // Run the checkJoyride function on initial load
  //   checkJoyride(pageKey);
  // }, []);

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
            key={joyrideKey} // Force re-render when key changes
            steps={steps}
            continuous={true}
            styles={{
              options: {
                arrowColor: "#5caeab",
                backgroundColor: "#5caeab",
                overlayColor: "rgba(92, 174, 171, .3)",
                primaryColor: "#5caeab",
                textColor: "#fff",
              },
              spotlight: {
                backgroundColor: "transparent",
              },
            }}
            showProgress={true}
            showSkipButton
          />
        )}
        <FormProvider>
          <EditProvider>{children}</EditProvider>
        </FormProvider>
      </body>
    </html>
  );
}
