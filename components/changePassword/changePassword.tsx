"use client"

import { Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import regex from "@/utils/regex";

export default function ChangePassword({ onChangePassword, onError }: { onChangePassword: (change: boolean) => void, onError: (context: string) => void }): React.JSX.Element {

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  const changePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      onError("رمزعبور جدید و تکرار آن یکسان نیستند");
      return;
    }

    await fetch("api/v1/auth/changepassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
    })
      .then(res => {
        switch (res.status) {
          case 201:
            onChangePassword(true);
            break;
          case 401:
            onError("رمزعبور قبلی نادرست است");
            break;
          default:
            onError("خطا نامشخص رخ داده است");
            break;
        }
      })
  }

  return (
    <>
      <div className="flex flex-col gap-4 justify-center">
        <TextField {...register("oldPassword", { pattern: regex.password, required: true })} required error={errors.oldPassword ? true : false} helperText={errors.oldPassword ? "لطفا رمز عبور قبلی خود را وارد کنید" : ""} label={<Typography sx={{ display: "inline" }} variant="body1">رمزعبور قبلی</Typography>} type="password" />
        <TextField {...register("newPassword", { pattern: regex.password, required: true })} required error={errors.newPassword ? true : false} helperText={errors.newPassword ? "لطفا رمز عبور جدید خود را وارد کنید" : ""} label={<Typography sx={{ display: "inline" }} variant="body1">رمزعبور جدید</Typography>} type="password" />
        <TextField {...register("confirmPassword", { pattern: regex.password, required: true })} required error={errors.confirmPassword ? true : false} helperText={errors.confirmPassword ? "لطفا تکرار رمز عبور جدید خود را وارد کنید" : ""} label={<Typography sx={{ display: "inline" }} variant="body1">تکرار رمزعبور جدید</Typography>} type="password" />
        <Button variant="contained" color="secondary" onClick={handleSubmit(changePassword)} sx={{ mt: 2 }}>ذخیره</Button>
      </div>
    </>
  )
}