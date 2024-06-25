import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import "../dist/tailwind/tailwindOutput.css";

import ThemeRegistry from "@/theme/ThemeRegistry";
import NavBar from "@/components/navbar/NavBar";
import StoreProvider from "@/lib/StoreProvider";

export const metadata: Metadata = {
  title: "Cartable",
  description: "Software to view, handle and track current affairs",
};

const c=cookies();
console.log(123, c);


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="persian-fa">
      <body dir="rtl">
        <StoreProvider>
          <ThemeRegistry options={{ key: 'muirtl' }}>
            <NavBar />
            {children}
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
