"use client"

import { useState, useEffect } from "react";
import { Box, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem } from "@mui/material";
import { useCookies } from "react-cookie";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearMe } from "@/lib/features/me/meSlice";
import { changeMode } from "@/lib/features/darkMode/darkSlice";
import Modal from "../modal/modal";
import ChangePassword from "@/components/changePassword/changePassword";
import Snack from "../snack/snack";

export default function MyAccount(): React.JSX.Element {

  const [isOpenSnack, setIsOpenSnack] = useState<boolean>(false);
  const [snackContext, setSnackContext] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [cookies, setCookie,] = useCookies(["dark-mode"]);
  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.me);
  const router = useRouter();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
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

  const handleCloseModal = () => {
    setIsOpenModal(false);
  }

  const handleChangePassword = () => {
    setIsOpenModal(true);
    setAnchorElUser(null);
  }
  
  useEffect(() => {
    dispatch(changeMode(cookies["dark-mode"] ?? false));
  }, [])

  const handleError = (context: string) => {
    setSnackContext(context);
    setIsOpenSnack(true);
  }
  
  const handleCloseSnack = () => {
    setIsOpenSnack(false);
  }
  
  const changePasswordSuccess = () => {
    setIsOpenModal(false);
    setSnackContext("رمزعبور با موفقیت تغییر کرد");
    setIsOpenSnack(true);
  }

  return (
    <>
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
            <Typography textAlign="right">{cookies["dark-mode"] ? "حالت روشن" : "حالت تاریک"}</Typography>
          </MenuItem>
          <MenuItem onClick={handleChangePassword}>
            <Typography textAlign="right">تغییر رمزعبور</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="right">خروج</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <Modal title="تغییر رمزعبور" isOpen={isOpenModal} body={<ChangePassword onChangePassword={changePasswordSuccess} onError={handleError} />} onCloseModal={handleCloseModal} />
      <Snack context={snackContext} isOpen={isOpenSnack} severity="error" onCloseSnack={handleCloseSnack} />
      <Snack context={snackContext} isOpen={isOpenSnack} severity="success" onCloseSnack={handleCloseSnack} />
    </>
  )
}