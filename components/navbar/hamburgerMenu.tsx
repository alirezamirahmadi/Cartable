"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, IconButton, Typography, MenuItem, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import type { MenuType } from "@/types/NavBarType";

export default function HamburgerMenu({ menuItems }: { menuItems: MenuType[] }): React.JSX.Element {

  const path = usePathname();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton size="large" onClick={(event => setAnchorElNav(event.currentTarget))} color="inherit">
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorElNav} anchorOrigin={{ vertical: "bottom", horizontal: "left", }} keepMounted
          transformOrigin={{ vertical: "top", horizontal: "left" }} open={Boolean(anchorElNav)}
          onClose={() => setAnchorElNav(null)} sx={{ display: { xs: "block", md: "none" } }}
        >
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <MenuItem onClick={() => setAnchorElNav(null)} sx={{ py: 0 }}>
                <Typography textAlign="center"
                  sx={[(theme) => ({ my: 1, px: 1, py: 0.3, borderRadius: 1.3, color: "white", display: "block", bgcolor: path === item.href ? theme.palette.secondary.main : "" })]}>
                  {item.title}
                </Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    </>
  )
}