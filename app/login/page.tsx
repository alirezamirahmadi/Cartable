"use client"

import { useState } from "react";
import { TextField, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import regex from "@/utils/regex";
import Snack from "@/components/general/snack/snack";
import type { LoginType } from "@/types/authType";
import type { SnackProps } from "@/types/generalType";

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
          router.replace("/")
          break;
        case 404:
          setSnackProps({ context: "نام کاربری یا رمزعبور نادرست است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      }
    });
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row justify-center items-center h-screen gap-x-20">
        <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-8 rounded-lg border w-72 md:w-96 h-fit">
          <TextField {...register("username", { required: true, pattern: regex.username })} error={errors.username ? true : false} helperText={errors.username && "نام کاربری می بایست بین 4 تا 20 کاراکتر باشد"} label={<Typography variant="body1">نام کاربری</Typography>} />
          <TextField {...register("password", { required: true, pattern: regex.password })} error={errors.password ? true : false} helperText={errors.password && "رمز عبور می بایست بین 8 تا 20 کاراکتر باشد"} label={<Typography variant="body1">رمز عبور</Typography>} type="password" />
          <Button variant="contained" size="large" onClick={handleSubmit(login)}>ورود</Button>
        </div>
        <div className="w-3/4 md:w-1/2">
          <img src="/svg/pages/login/login.svg" alt="" />
        </div>
      </div>
      <Snack {...snackProps} />
    </>
  )
}