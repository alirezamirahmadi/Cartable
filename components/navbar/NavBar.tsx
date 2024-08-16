"use client"

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";

import { MainMenuData } from "@/utils/data";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getMe, clearMe } from "@/lib/features/me/meSlice";
import MyAccount from "../general/myAccount/myAccount";

export default function NavBar() {

  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.me);
  const router = useRouter();
  const pathName = usePathname();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [menuItemSelected, setMenuItemSelected] = useState<string>("");

  useEffect(() => {
    setMenuItemSelected(pathName);
    dispatch(getMe());
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = (href: string) => {
    setAnchorElNav(null);
    setMenuItemSelected(href);
    router?.replace(href);
  }

  if (!me.isLogin) {
    return (<></>);
  }

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography variant="h6" noWrap component="a" href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2, display: { xs: "none", md: "flex" }, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem",
              color: "inherit", textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorElNav} anchorOrigin={{ vertical: "bottom", horizontal: "left", }} keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }} open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)} sx={{ display: { xs: "block", md: "none" } }}
            >
              {MainMenuData.map((page) => (
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
            {MainMenuData.map((page) => (
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
