"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button } from "@mui/material";

import type { MenuType } from "@/types/NavBarType";

export default function Menu({ menuItems }: { menuItems: MenuType[] }): React.JSX.Element {

  const path = usePathname();

  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {menuItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <Button sx={{ my: 2, color: "white", display: "block", bgcolor: path === item.href ? "secondary.main" : "" }}>
              {item.title}
            </Button>
          </Link>
        ))}
      </Box>
    </>
  )
}