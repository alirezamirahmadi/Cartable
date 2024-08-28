"use client"

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";

import { MainMenuData } from "@/utils/data";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getMe } from "@/lib/features/me/meSlice";
import MyAccount from "../general/myAccount/myAccount";
import { MenuType } from "@/types/NavBarType";

export default function NavBar(): React.JSX.Element {

  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.me);
  const router = useRouter();
  const pathName = usePathname();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [menuItemSelected, setMenuItemSelected] = useState<string>("");
  const [menuData, setMenuData] = useState<MenuType[]>([]);

  useEffect(() => {
    setMenuItemSelected(pathName);
    dispatch(getMe());
  }, []);

  useMemo(() => {
    setMenuData([...MainMenuData].filter((menu: MenuType) => me.permissions.includes(menu.href)))
  }, [me.permissions])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = (href: string) => {
    setAnchorElNav(null);
    setMenuItemSelected(href);
    router?.replace(href);
    (href === "/inbox" || href === "/outbox") && router.refresh();
  }

  if (!me.isLogin) {
    return (<></>);
  }

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Link href="/">
            <Typography variant="h6" noWrap
              sx={{
                mr: 2, display: { xs: "none", md: "flex" }, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem",
                color: "inherit", textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorElNav} anchorOrigin={{ vertical: "bottom", horizontal: "left", }} keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }} open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)} sx={{ display: { xs: "block", md: "none" } }}
            >
              {menuData.map((page) => (
                <MenuItem key={page.id} onClick={() => handleCloseNavMenu(page.href)}>
                  <Typography textAlign="center"
                    sx={[(theme) => ({ my: 2, color: "white", display: "block", bgcolor: menuItemSelected === page.href ? theme.palette.secondary.main : "" })]}>
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography variant="h5" noWrap component="a" href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2, display: { xs: "flex", md: "none" }, flexGrow: 1, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem",
              color: "inherit", textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {menuData.map((page) => (
              <Button key={page.id} onClick={() => handleCloseNavMenu(page.href)}
                sx={[(theme) => ({ my: 2, color: "white", display: "block", bgcolor: menuItemSelected === page.href ? theme.palette.secondary.main : "" })]}>
                {page.title}
              </Button>
            ))}
          </Box>
          <MyAccount />
        </Toolbar>
      </Container>
    </AppBar >
  );
}
