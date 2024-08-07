"use client"

import { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, TextField, Typography, Button } from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useForm } from "react-hook-form";

import type { PersonType } from "@/types/personType";
import AutoComplete from "../general/autoComplete/autoComplete";
import Snack from "../general/snack/snack";
import type { SnackProps } from "@/types/generalType";

export default function RoleModify({ role, root, onModify }: { role?: any, root: string | null, onModify?: (isModify: boolean) => void }): React.JSX.Element {

  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [persons, setPersons] = useState<PersonType[]>([]);
  const [refPerson, setRefPerson] = useState<string | null>(null);

  const { register, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: role?.title ?? "",
      isActive: role?.isActive ?? false,
    }
  })

  useEffect(() => {
    loadPersonData();
  }, [])

  const loadPersonData = async () => {
    await fetch("api/v1/persons")
      .then(res => res.json())
      .then(res => { setPersons(res) })
  }

  const submitRole = (data: any) => {
    role ? putRole(data) : postRole(data);
  }

  const postRole = async (data: any) => {
    await fetch("api/v1/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: data.title, refPerson, root, isActive: data.isActive })
    })
      .then(res => {
        if (res.status === 201) {
          onModify && onModify(true);
        }
      })
      .catch(() => {
        setSnackProps({ context: "عملیات ایجاد سمت جدید با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      })
  }

  const putRole = async (data: any) => {
    await fetch(`api/v1/roles/${role._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: data.title, refPerson, root: data.root, isActive: data.isActive })
    })
      .then(res => {
        if (res.status === 201) {
          onModify && onModify(true);
          setValue("isActive", data.isActive)
          reset();
        }
      })
      .catch(() => {
        setSnackProps({ context: "عملیات ویرایش سمت با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      })
  }

  const handleSelectedPerson = (personId: string) => {
    setRefPerson(personId);
  }

  return (
    <>
      <div className="lg:col-span-3 md:col-span-2">
        <div className="flex flex-wrap gap-4 justify-center">
          <TextField {...register("title")} required error={errors.title ? true : false} helperText={errors.title ? "لطفا عنوان را وارد کنید" : ""} size="small" label={<Typography variant="body1" sx={{ display: "inline" }}>عنوان</Typography>} />
          <AutoComplete options={persons} defaultValueId={role?.person?._id ?? ""} getSelectedId={handleSelectedPerson} inputProps={{ label: "شخص", size: "small", width: 300 }} key={JSON.stringify(persons)} />
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register("isActive")} defaultChecked={role ? getValues("isActive") : false} color="primary" />} label="فعال" />
          </FormGroup>
        </div>
        <div className="flex justify-center gap-x-2 mt-4">
          <Button variant="contained" color="secondary" startIcon={<KeyboardArrowUpOutlinedIcon />} onClick={handleSubmit(submitRole)}>ذخیره</Button>
          <Snack {...snackProps} />
        </div>
      </div>
    </>
  )
}