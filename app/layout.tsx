import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "../dist/tailwind/tailwindOutput.css";

import ThemeRegistry from "@/theme/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className} dir="rtl">
        <ThemeRegistry options={{ key: 'muirtl' }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
