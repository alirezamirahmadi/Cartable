"use client"

import { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, TextField, Typography, Autocomplete, Button } from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useForm } from "react-hook-form";

import type { RoleType } from "@/types/RoleType";
import type { PersonType } from "@/types/PersonType";

export default function RoleModify({ role }: { role?: RoleType }): React.JSX.Element {

  const [persons, setPersons] = useState<PersonType[]>([]);
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    defaultValues: {
      title: role?.title ?? "",
      person: "",
      isActive: role?.isActive ?? false,
    }
  })

  const submitRole = (data: any) => {
    console.log(data);
  }

  useEffect(() => {
    fetch("api/v1/persons")
      .then(res => res.json())
      .then(res => { setPersons(res) })
  }, [])

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <TextField {...register("title")} required error={errors.title ? true : false} helperText={errors.title ? "لطفا عنوان را وارد کنید" : ""} size="small" label={<Typography variant="body1" sx={{ display: "inline" }}>عنوان</Typography>} />
        <Autocomplete freeSolo disableClearable options={persons.map((option) => option.firstName + " " + option.lastName)}
          renderInput={(params) => (<TextField {...register("person")} {...params} size="small" label="شخص" sx={{ width: 300 }}
            InputProps={{ ...params.InputProps, type: 'search' }} />
          )}
        />
        <FormGroup>
          <FormControlLabel control={<Checkbox {...register("isActive")} defaultChecked={role ? role.isActive : false} color="primary" />} label="فعال" />
        </FormGroup>
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="contained" color="secondary" startIcon={<KeyboardArrowUpOutlinedIcon />} onClick={handleSubmit(submitRole)}>ذخیره</Button>
      </div>
    </>
  )
}