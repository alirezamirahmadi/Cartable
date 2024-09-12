import { cookies } from "next/headers";
import type { Metadata } from "next";

import "./globals.css";
import "../dist/tailwind/tailwindOutput.css";

import ThemeRegistry from "@/theme/ThemeRegistry";
import StoreProvider from "@/lib/StoreProvider";

export const metadata: Metadata = {
  title: "Cartable",
  description: "Software to view, handle and track current affairs",
  icons: { icon: "image/app/favicon.png" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const darkMode = cookies().get("dark-mode")?.value;

  return (
    <html lang="persian-fa">
      <body dir="rtl">
        <StoreProvider>
          <ThemeRegistry options={{ key: 'muirtl' }} darkMode={darkMode === "true"}>
            {children}
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
