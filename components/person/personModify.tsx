"use client"

import { useState } from "react";
import { TextField, Typography, Checkbox, FormGroup, FormControlLabel, Divider, Button, Select, MenuItem } from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { Value as DatePickerType } from "react-multi-date-picker";

import { PersonType } from "@/types/PersonType";
import regex from "@/utils/regex";

export default function PersonModify({ person }: { person?: PersonType }): React.JSX.Element {

  const [birthday, setBirthday] = useState<DatePickerType>("");
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({
    defaultValues: {
      code: person?.code ?? "",
      firstName: person?.firstName ?? "",
      lastName: person?.lastName ?? "",
      nationalCode: person?.nationalCode ?? "",
      gender: person?.gender ?? 1,
      maritalStatus: person?.maritalStatus ?? false,
      education: person?.education ?? "",
      phone: person?.phone ?? "",
      email: person?.email ?? "",
      address: person?.address ?? "",
      description: person?.description ?? "",
      isActive: person?.isActive ?? false,

      username: person?.account?.username ?? "",
      password: "",
    }
  });

  const submitPerson = (data: any) => {
    fetch("api/v1/persons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, birthday, account: { username: data.username, password: data.password } })
    });

    reset();
  }

  return (
    <>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-2 place-items-center">
          <TextField {...register("code")} size="small" error={errors.code ? true : false} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>کد</Typography>} />
          <TextField {...register("firstName", { required: true, pattern: regex.flName })} size="small" error={errors.firstName ? true : false} required helperText={errors.firstName && "نام می بایست بین 3 تا 50 کاراکتر باشد"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>نام</Typography>} />
          <TextField {...register("lastName", { required: true, pattern: regex.flName })} size="small" error={errors.lastName ? true : false} required helperText={errors.lastName && "نام خانوادگی می بایست بین 3 تا 50 کاراکتر باشد"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>نام خانوادگی</Typography>} />
          <TextField {...register("nationalCode")} size="small" variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>کدملی</Typography>} />
          <DatePicker
            id="birthday" calendar={persian} locale={persian_fa} calendarPosition="bottom-right" value={birthday} onChange={setBirthday}
            render={(value, openCalendar) => { return (<TextField variant="outlined" label='تاریخ تولد' value={value} onClick={openCalendar} size="small"></TextField>) }}
          />
          <TextField {...register("education")} size="small" variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>تحصیلات</Typography>} />
          <TextField {...register("phone", { pattern: regex.phone })} size="small" error={errors.phone ? true : false} helperText={errors.phone && "لطفا شماره موبایل را با فرمت صحیح وارد کنید"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>موبایل</Typography>} />
          <TextField {...register("email", { pattern: regex.email })} size="small" error={errors.email ? true : false} helperText={errors.email && "لطفا ایمیل را با فرمت صحیح وارد کنید"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>ایمیل</Typography>} />
          <TextField {...register("address")} size="small" variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>آدرس</Typography>} />
          <TextField {...register("description")} size="small" variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>توضیحات</Typography>} />
          <FormGroup sx={{ display: "inline" }}>
            <Select {...register("gender")} size="small" defaultValue={person ? getValues("gender") : 1} label="جنسیت" sx={{ width: "fit-content" }}>
              <MenuItem value="1">مرد</MenuItem>
              <MenuItem value="2">زن</MenuItem>
            </Select>
            <FormControlLabel control={<Checkbox {...register("isActive")} defaultChecked={person ? getValues("isActive") : false} color="primary" />} label="فعال" />
            <FormControlLabel control={<Checkbox {...register("maritalStatus")} defaultChecked={person ? getValues("maritalStatus") : false} color="primary" />} label="متاهل" />
          </FormGroup>
        </div>

        <Divider sx={{ width: "75%", mx: "auto", my: "1rem" }} />

        <div className="flex flex-wrap justify-center gap-y-2 gap-x-8">
          <TextField {...register("username", { required: true, pattern: regex.username })} size="small" error={errors.username ? true : false} required helperText={errors.username && "نام کاربری می بایست بین 4 تا 20 کاراکتر باشد"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>نام کاربری</Typography>} />
          <TextField {...register("password", { required: true, pattern: regex.password })} size="small" error={errors.password ? true : false} required helperText={errors.password && "رمز عبور می بایست بین 8 تا 20 کاراکتر باشد"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>رمز عبور</Typography>} type="password" />
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="contained" color="secondary" onClick={handleSubmit(submitPerson)} startIcon={<KeyboardArrowUpOutlinedIcon />}>ذخیره</Button>
        </div>
      </form>
    </>
  )
}