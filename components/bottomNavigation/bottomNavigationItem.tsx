"use client";

import { ReactNode } from "react";
import { BottomNavigationAction } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNavigationItem({ label, icon, href }:
  { label: string, icon: ReactNode, href: string }): React.JSX.Element {

  const path = usePathname();
  const router = useRouter();

  return (
    <BottomNavigationAction showLabel label={label} icon={icon} onClick={() => router.replace(href)} sx={{ color: path === href ? "secondary.main" : "inherit" }} />
  )
}