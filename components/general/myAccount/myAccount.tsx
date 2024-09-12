"use client"

import { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { Box, IconButton, Typography, Menu, Avatar, MenuItem, ListItemText } from "@mui/material";
import { useCookies } from "react-cookie";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const Modal = dynamic(() => import("../modal/modal"));
const Snack = dynamic(() => import("../snack/snack"));
const MyRoles = dynamic(() => import("../myRoles/myRoles"));
import { useAppDispatch } from "@/lib/hooks";
import { setMe, clearMe } from "@/lib/features/me/meSlice";
import { changeMode } from "@/lib/features/darkMode/darkSlice";
import ChangePassword from "@/components/changePassword/changePassword";
import type { SnackProps } from "@/types/generalType";
import { MeType } from "@/types/authType";

const MyAccount = memo(({ me }: { me: MeType }): React.JSX.Element => {

  const [isOpenPasswordModal, setIsOpenPasswordModal] = useState<boolean>(false);
  const [isOpenRolesModal, setIsOpenRolesModal] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const { resolvedTheme, setTheme } = useTheme();
  const [cookies, setCookie,] = useCookies(["dark-mode"]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(changeMode(cookies["dark-mode"] ?? false));
  }, []);

  useEffect(() => {
    me && dispatch(setMe(me));
  }, []);

  useEffect(() => {
    me && dispatch(setMe(me));
  }, [me]);

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
        return res.status;
      })
      .then(status => status === 200 && router.refresh())
    setAnchorElUser(null);
  }

  const handleCloseModal = () => {
    setIsOpenPasswordModal(false);
    setIsOpenRolesModal(false);
  }

  const handleChangeRole = (isChange: boolean) => {
    if (isChange) {
      setIsOpenRolesModal(false);
      router.refresh();
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
        <Box sx={{ display: "flex", columnGap: 1 }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} title="کاربری من">
            <Avatar alt={me?.firstName} src={me?.avatar} />
          </IconButton>
          <ListItemText primary={`${me?.firstName} ${me?.lastName}`} secondary={me?.defaultRole?.title} sx={{ display: { xs: "none", md: "block" } }} />
        </Box>
        <Menu sx={{ mt: "45px" }} anchorEl={anchorElUser} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right", }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem >
            <ListItemText primary={`${me?.firstName} ${me?.lastName}`} secondary={me?.defaultRole?.title} sx={{ display: { xs: "block", md: "none" } }} />
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