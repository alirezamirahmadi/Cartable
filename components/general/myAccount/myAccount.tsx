"use client"

import { useState, useEffect, memo } from "react";
import { Box, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem, ListItemText } from "@mui/material";
import { useCookies } from "react-cookie";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearMe } from "@/lib/features/me/meSlice";
import { changeMode } from "@/lib/features/darkMode/darkSlice";
import Modal from "../modal/modal";
import ChangePassword from "@/components/changePassword/changePassword";
import Snack from "../snack/snack";
import MyRoles from "../myRoles/myRoles";

const MyAccount = memo((): React.JSX.Element => {

  const [isOpenSnack, setIsOpenSnack] = useState<boolean>(false);
  const [snackContext, setSnackContext] = useState<string>("");
  const [isOpenPasswordModal, setIsOpenPasswordModal] = useState<boolean>(false);
  const [isOpenRolesModal, setIsOpenRolesModal] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [cookies, setCookie,] = useCookies(["dark-mode"]);
  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.me);
  const router = useRouter();

  useEffect(() => {
    dispatch(changeMode(cookies["dark-mode"] ?? false));
  }, [])

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
    setIsOpenPasswordModal(false);
    setIsOpenRolesModal(false);
  }

  const handleChangePassword = () => {
    setIsOpenPasswordModal(true);
    setAnchorElUser(null);
  }

  const handleMyRoles = () => {
    setIsOpenRolesModal(true);
    setAnchorElUser(null);
  }

  const handleError = (context: string) => {
    setSnackContext(context);
    setIsOpenSnack(true);
  }

  const handleCloseSnack = () => {
    setIsOpenSnack(false);
  }

  const changePasswordSuccess = () => {
    setIsOpenPasswordModal(false);
    setSnackContext("رمزعبور با موفقیت تغییر کرد");
    setIsOpenSnack(true);
  }

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="کاربری من">
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
            <ListItemText primary={`${me.firstName} ${me.lastName}`} secondary={me.defaultRole.title} />
          </MenuItem>
          <MenuItem onClick={handleMyRoles}>
            <Typography textAlign="right">سمت های من</Typography>
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
      <Modal title="تغییر رمزعبور" isOpen={isOpenPasswordModal} body={<ChangePassword onChangePassword={changePasswordSuccess} onError={handleError} />} onCloseModal={handleCloseModal} />
      <Modal title="سمت های من" isOpen={isOpenRolesModal} body={<MyRoles />} onCloseModal={handleCloseModal} />

      <Snack context={snackContext} isOpen={isOpenSnack} severity="error" onCloseSnack={handleCloseSnack} />
      <Snack context={snackContext} isOpen={isOpenSnack} severity="success" onCloseSnack={handleCloseSnack} />
    </>
  )
})

export default MyAccount;