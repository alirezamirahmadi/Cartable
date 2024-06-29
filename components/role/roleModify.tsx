"use client"

import { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, TextField, Typography, Button, Autocomplete, Box } from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useForm } from "react-hook-form";

import type { RoleType } from "@/types/RoleType";
import type { PersonType } from "@/types/PersonType";
import AutoComplete from "../general/autoComplete/autoComplete";
import Modal from "../general/modal/modal";

export default function RoleModify({ role }: { role?: RoleType }): React.JSX.Element {

  const [isOpenModal, setIsOpenModal] = useState(false);

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

  const handleSelectedPerson = (personId: string) => {
    console.log(personId);

  }

  const openModal = () => {
    setIsOpenModal(true);
  }

  const closeModal = () => {
    setIsOpenModal(false);
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <TextField {...register("title")} required error={errors.title ? true : false} helperText={errors.title ? "لطفا عنوان را وارد کنید" : ""} size="small" label={<Typography variant="body1" sx={{ display: "inline" }}>عنوان</Typography>} />
        <AutoComplete options={persons} getSelectedId={handleSelectedPerson} inputProps={{ label: "شخص", size: "small", width: 300 }} />
        <FormGroup>
          <FormControlLabel control={<Checkbox {...register("isActive")} defaultChecked={role ? role.isActive : false} color="primary" />} label="فعال" />
        </FormGroup>
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="contained" color="secondary" startIcon={<KeyboardArrowUpOutlinedIcon />} onClick={handleSubmit(submitRole)}>ذخیره</Button>
      </div>
      <Modal title="AnnaLena" isOpen={isOpenModal} closeModal={closeModal} body={
        <Typography></Typography>
      } />
    </>
  )
}