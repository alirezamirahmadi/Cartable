"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, Button, IconButton, Typography, MenuItem, Menu as MUIMenu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import type { MenuType } from "@/types/NavBarType";

export default function Menu({ menuData, hamburgerMenu, permissions }:
  { menuData: MenuType[], hamburgerMenu?: boolean, permissions: string[] }): React.JSX.Element {

  const router = useRouter();
  const path = usePathname();
  const [menuItemSelected, setMenuItemSelected] = useState<string>("");
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [menuItems, setMenuItems] = useState<MenuType[]>([]);

  useEffect(() => {
    setMenuItemSelected(path);
  }, []);

  useMemo(() => {
    setMenuItems([...menuData].filter((menu: MenuType) => permissions.includes(menu.href)))
  }, [permissions])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = (href: string) => {
    setAnchorElNav(null);
    setMenuItemSelected(href);
    router?.replace(href);
    (href === "/inbox" || href === "/outbox") && router.refresh();
  }

  return (
    <>
      {!hamburgerMenu
        ?
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {menuItems.map((item) => (
            <Button key={item.id} onClick={() => handleCloseNavMenu(item.href)}
              sx={[(theme) => ({ my: 2, color: "white", display: "block", bgcolor: menuItemSelected === item.href ? theme.palette.secondary.main : "" })]}>
              {item.title}
            </Button>
          ))}
        </Box>
        :
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>
          <MUIMenu anchorEl={anchorElNav} anchorOrigin={{ vertical: "bottom", horizontal: "left", }} keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }} open={Boolean(anchorElNav)}
            onClose={() => setAnchorElNav(null)} sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.id} onClick={() => handleCloseNavMenu(item.href)}>
                <Typography textAlign="center"
                  sx={[(theme) => ({ my: 1, p: 1, borderRadius: 1.3, color: "white", display: "block", bgcolor: menuItemSelected === item.href ? theme.palette.secondary.main : "" })]}>
                  {item.title}
                </Typography>
              </MenuItem>
            ))}
          </MUIMenu>
        </Box>}
    </>
  )
}