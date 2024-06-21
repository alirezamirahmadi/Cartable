import type { Metadata } from "next";

import "./globals.css";
import "../dist/tailwind/tailwindOutput.css";

import ThemeRegistry from "@/theme/ThemeRegistry";

export const metadata: Metadata = {
  title: "Cartable",
  description: "Software to view, handle and track current affairs",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="persian-fa">
      <body dir="rtl">
        <ThemeRegistry options={{ key: 'muirtl' }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
