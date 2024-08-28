"use client"

import { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { Box, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem, ListItemText } from "@mui/material";
import { useCookies } from "react-cookie";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const Modal = dynamic(() => import("../modal/modal"));
const Snack = dynamic(() => import("../snack/snack"));
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getMe, clearMe } from "@/lib/features/me/meSlice";
import { changeMode } from "@/lib/features/darkMode/darkSlice";
import ChangePassword from "@/components/changePassword/changePassword";
import MyRoles from "../myRoles/myRoles";
import type { SnackProps } from "@/types/generalType";

const MyAccount = memo((): React.JSX.Element => {

  const [isOpenPasswordModal, setIsOpenPasswordModal] = useState<boolean>(false);
  const [isOpenRolesModal, setIsOpenRolesModal] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
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
    setTheme(cookies["dark-mode"] ? "light" : "dark");
    setCookie("dark-mode", !cookies["dark-mode"], { maxAge: 2_592_000 });
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

  const handleChangeRole = (isChange: boolean) => {
    if (isChange) {
      setIsOpenRolesModal(false);
      dispatch(getMe())
        .then(() => router.replace("/"));
    }
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
    setSnackProps({ context, isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
  }

  const changePasswordSuccess = () => {
    setIsOpenPasswordModal(false);
    setSnackProps({ context: "رمزعبور با موفقیت تغییر کرد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
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

      {snackProps.isOpen && <Snack {...snackProps} />}
      {isOpenPasswordModal && <Modal title="تغییر رمزعبور" isOpen={isOpenPasswordModal} body={<ChangePassword onChangePassword={changePasswordSuccess} onError={handleError} />} onCloseModal={handleCloseModal} />}
      {isOpenRolesModal && <Modal title="سمت های من" isOpen={isOpenRolesModal} body={<MyRoles onChangeRole={handleChangeRole} />} onCloseModal={handleCloseModal} />}
    </>
  )
})

export default MyAccount;