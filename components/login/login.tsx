"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { TextField, Typography, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";

const Snack = dynamic(() => import("@/components/general/snack/snack"));
import regex from "@/utils/regex";
import type { SnackProps } from "@/types/generalType";
import type { LoginType } from "@/types/authType";

export default function Login(): React.JSX.Element {

  const router = useRouter();
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const login = async (data: LoginType) => {
    await fetch("api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(data)
    }).then(res => {
      switch (res.status) {
        case 200:
          router.replace("/");
          break;
        case 404:
          setSnackProps({ context: "نام کاربری یا رمزعبور نادرست است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      }
      return res.status;
    }).then(status => status === 200 && router.refresh())
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, md: 2 }, padding: { xs: 1, md: 2 }, borderRadius: 1, borderWidth: 1, width: { xs: 250, md: 350 }, height: "fit-content" }}>
        <TextField {...register("username", { required: true, pattern: regex.username })} error={errors.username ? true : false} helperText={errors.username && "نام کاربری می بایست بین 4 تا 20 کاراکتر باشد"} label={<Typography variant="body1">نام کاربری</Typography>} />
        <TextField {...register("password", { required: true, pattern: regex.password })} error={errors.password ? true : false} helperText={errors.password && "رمز عبور می بایست بین 8 تا 20 کاراکتر باشد"} label={<Typography variant="body1">رمز عبور</Typography>} type="password" />
        <Button variant="contained" size="large" onClick={handleSubmit(login)}>ورود</Button>
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}