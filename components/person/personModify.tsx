"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  TextField, Typography, Checkbox, FormGroup, FormControlLabel, Divider, Button, Select, MenuItem,
  Badge, Avatar, Box, IconButton
} from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DrawIcon from '@mui/icons-material/Draw';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useRouter } from "next/navigation";
import type { Value as DatePickerType } from "react-multi-date-picker";

const Snack = dynamic(() => import("../general/snack/snack"));
import regex from "@/utils/regex";
import { useAppSelector } from "@/lib/hooks";
import VisuallyHiddenInput from "../general/visuallyHiddenInput/visuallyHiddenInput";
import type { SnackProps } from "@/types/generalType";
import type { PersonType } from "@/types/personType";
import ModifyButtons from "../general/modifyButtons/modifyButtons";

export default function PersonModify({ person, onModify }: { person?: PersonType, onModify?: (isModify: boolean) => void }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const router = useRouter();
  const [birthday, setBirthday] = useState<DatePickerType>(person?.birthday ?? "");
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [image, setImage] = useState<Blob | string>();
  const [sign, setSign] = useState<Blob | string>();

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
      image: null,
      sign: null,
      username: person?.account?.username ?? "",
      password: "",
    }
  });

  const submitPerson = (data: any) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("nationalCode", data.nationalCode);
    formData.append("birthday", birthday?.valueOf().toString() ?? "");
    formData.append("gender", data.gender);
    formData.append("maritalStatus", data.maritalStatus);
    formData.append("education", data.education);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("description", data.description);
    formData.append("isActive", data.isActive);
    formData.append("image", image ?? "");
    formData.append("sign", sign ?? "");
    formData.append("username", data.username);
    formData.append("password", data.password);

    person ? editPerson(formData) : addPerson(formData);
  }

  const addPerson = async (formData: FormData) => {
    await fetch("api/v1/persons", {
      method: "POST",
      body: formData,
    })
      .then(res => {
        res.status === 201 ?
          setSnackProps({ context: "شخص جدید با موفقیت ایجاد شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
          :
          setSnackProps({ context: "عملیات مورد نظر با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
      .then(() => router.refresh())
    reset();
  }

  const editPerson = async (formData: FormData) => {
    await fetch(`api/v1/persons/${person?._id}`, {
      method: "PUT",
      body: formData,
    })
      .then(res => { onModify && onModify(res.status === 201 ? true : false) })
  }

  return (
    <>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-2 place-items-center">
          <Box sx={{ display: "flex", alignItems: "end" }}>
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <>
                  <IconButton component="label">
                    <EditIcon fontSize="small" />
                    <VisuallyHiddenInput type="file" onChange={event => setImage(event.target.files ? event.target.files[0] : undefined)} />
                  </IconButton>
                </>
              }
            >
              <Avatar alt={person?.firstName ?? ""} src={(person?.image && image !== "Delete") ? person?.image : ""} sx={{ width: 52, height: 52 }}>
                {!image && image !== "Delete" && <PersonIcon fontSize="large" />}
                {image && image !== "Delete" && <HowToRegIcon fontSize="large" />}
                {image === "Delete" && <DeleteForeverIcon fontSize="large" />}
              </Avatar>
            </Badge>
            {person?.image && <ModifyButtons onAction={(data: any, action: string) => setImage(action)} omit omitMessage={`آیا از حذف تصویر ${person?.firstName} مطمئن هستید؟`} />}
          </Box>
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

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-4 sm:gap-x-8 justify-items-center place-items-center">
          <div className="grid grid-rows-2 justify-items-center gap-y-2 col-span-3">
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: 2, columnGap: 4 }}>
              <TextField {...register("username", { required: true, pattern: regex.username })} size="small" error={errors.username ? true : false} required helperText={errors.username && "نام کاربری می بایست بین 4 تا 20 کاراکتر باشد"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>نام کاربری</Typography>} />
              <TextField {...register("password", { required: true, pattern: regex.password })} size="small" error={errors.password ? true : false} required helperText={errors.password && "رمز عبور می بایست بین 8 تا 20 کاراکتر باشد"} variant="outlined" label={<Typography variant="body1" sx={{ display: "inline" }}>رمز عبور</Typography>} type="password" />
            </Box>
            {(person || me.permissions.includes("/persons.new")) &&
              <Button variant="contained" color="primary" onClick={handleSubmit(submitPerson)} startIcon={<KeyboardArrowUpOutlinedIcon />}>ذخیره</Button>
            }
          </div>
          <Box sx={{ display: "flex", alignItems: "end" }}>
            <Avatar variant="rounded" alt={person?.firstName ?? ""} src={person?.sign ?? ""} sx={{ width: 80, height: 80 }}>
              {!sign && sign !== "Delete" && <DrawIcon fontSize="large" />}
              {sign && sign !== "Delete" && <PriceCheckIcon fontSize="large" />}
              {sign === "Delete" && <DeleteForeverIcon fontSize="large" />}
            </Avatar>
            <Box>
              <IconButton component="label">
                <AttachFileIcon />
                <VisuallyHiddenInput type="file" onChange={event => setSign(event.target.files ? event.target.files[0] : undefined)} />
              </IconButton>
              {person?.sign && <ModifyButtons onAction={(data: any, action: string) => setSign(action)} omit omitMessage={`آیا از حذف امضا ${person?.firstName} مطمئن هستید؟`} />}
            </Box>
          </Box>
        </div>
      </form>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}
