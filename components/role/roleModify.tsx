"use client"

import { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, TextField, Typography, Button, Autocomplete, Box } from "@mui/material";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";

import type { RoleType } from "@/types/RoleType";
import type { PersonType } from "@/types/PersonType";
import AutoComplete from "../general/autoComplete/autoComplete";
import Modal from "../general/modal/modal";

export default function RoleModify({ role, root, onModify }: { role?: RoleType, root: string, onModify?: (isModify: boolean) => void }): React.JSX.Element {

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [persons, setPersons] = useState<PersonType[]>([]);
  const [refPerson, setRefPerson] = useState<string>("");
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    defaultValues: {
      title: role?.title ?? "",
      person: "",
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
    }
    
    const putRole = async (data: any) => {

  }

  const handleSelectedPerson = (personId: string) => {
    setRefPerson(personId);
  }

  const handleOpenModal = () => {
    setIsOpenModal(true);
  }
  
  const handleCloseModal = () => {
    setIsOpenModal(false);
  }
  
  const handleModify = (isModify: boolean) => {
    if (isModify) {
      onModify && onModify(true);
      setIsOpenModal(false);
      loadPersonData();
    }
  }

  return (
    <>
      <div className="lg:col-span-3 md:col-span-2">
        <div className="flex flex-wrap gap-4 justify-center">
          <TextField {...register("title")} required error={errors.title ? true : false} helperText={errors.title ? "لطفا عنوان را وارد کنید" : ""} size="small" label={<Typography variant="body1" sx={{ display: "inline" }}>عنوان</Typography>} />
          <AutoComplete options={persons} getSelectedId={handleSelectedPerson} inputProps={{ label: "شخص", size: "small", width: 300 }} />
          <FormGroup>
            <FormControlLabel control={<Checkbox {...register("isActive")} defaultChecked={role ? role.isActive : false} color="primary" />} label="فعال" />
          </FormGroup>
        </div>
        <div className="flex justify-center gap-x-2 mt-4">
          <Button variant="contained" color="secondary" startIcon={<KeyboardArrowUpOutlinedIcon />} onClick={handleSubmit(submitRole)}>ذخیره</Button>
          {role && <Button variant="outlined" color="secondary" startIcon={<AddIcon />} onClick={handleOpenModal}>جدید</Button>}
        </div>
      </div>
      <Modal title="سمت جدید" isOpen={isOpenModal} onCloseModal={handleCloseModal} body={<RoleModify root={root} onModify={handleModify} />} />
    </>
  )
}