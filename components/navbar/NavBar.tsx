"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { useCookies } from "react-cookie";
import { useTheme } from "next-themes";

import { MainMenuData } from "@/utils/data";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getMe, clearMe } from "@/lib/features/me/meSlice";
import { changeMode } from "@/lib/features/darkMode/darkSlice";

const settings = ["تغیر رمزعبور"];

export default function NavBar() {

  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.me);
  const [cookies, setCookie,] = useCookies(["dark-mode"]);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }

  const handleCloseNavMenu = (href: string) => {
    setAnchorElNav(null);
    router.replace(href);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  const handleDarkMode = () => {
    dispatch(changeMode(!cookies["dark-mode"]));
    setTheme(resolvedTheme === "light" ? "dark" : "light");
    setCookie("dark-mode", !cookies["dark-mode"]);
    setAnchorElUser(null);
  }
  
  const handleLogout = async () => {
    await fetch("api/v1/auth/logout")
    .then(res => {
      if (res.status === 200) {
        dispatch(clearMe());
        router.replace("login");
      }
    })
    setAnchorElUser(null);
  }

  useEffect(() => {
    dispatch(changeMode(cookies["dark-mode"] ?? false));
    dispatch(getMe());
  }, [])
  
  if(!me.isLogin){
    return(<></>);
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography variant="h6" noWrap component="a" href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
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
              onClose={handleCloseNavMenu} sx={{ display: { xs: "block", md: "none" } }}
            >
              {MainMenuData.map((page) => (
                <MenuItem key={page.id} onClick={() => handleCloseNavMenu(page.href)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography variant="h5" noWrap component="a" href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {MainMenuData.map((page) => (
              <Button key={page.id} onClick={() => handleCloseNavMenu(page.href)} sx={{ my: 2, color: "white", display: "block" }}>
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu sx={{ mt: "45px" }} anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem >
                <Typography textAlign="right">{me.firstName} {me.lastName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleDarkMode}>
                <Typography textAlign="right">دارک/لایت</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="right">خروج</Typography>
              </MenuItem>
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="right">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
