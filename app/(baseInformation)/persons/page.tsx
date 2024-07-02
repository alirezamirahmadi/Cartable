"use client"

import { useState, useEffect } from "react";
import PersonModify from "@/components/person/personModify";
import { Divider } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import { PersonType } from "@/types/PersonType";

import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import Modal from "@/components/general/modal/modal";
import Delete from "@/components/general/delete/delete";

export default function Persons(): React.JSX.Element {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [personData, setPersonData] = useState<PersonType[]>([]);
  const [rowData, setRowData] = useState<PersonType>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

  const columns: ColumnType[] = [
    { field: { title: "id" }, label: "ID", options: { display: false } },
    { field: { title: "firstName" }, label: "نام" },
    { field: { title: "lastName" }, label: "نام خانوادگی" },
    { field: { title: "code" }, label: "کد" },
    { field: { title: "isActive" }, label: "فعال", kind: "boolean" },
    { field: { title: "account.username" }, label: "نام کاربری" },
    {
      field: { title: "ویرایش" }, label: "ویرایش", kind: "component", options: {
        component: (value, onChange, rowData) => (<ModifyButtons value={value} onChange={(event: any) => onChange && onChange(event.target.value)} rowData={rowData} handleAction={handleAction} />)
      }
    },
  ]

  const handleAction = (data: PersonType, action: string) => {
    setRowData(data);
    switch (action) {
      case "Edit":
        setIsOpenEditModal(true);
        break;
      case "Delete":
        setIsOpenDeleteModal(true);
        break;
    }
  }

  useEffect(() => {
    fetch("api/v1/persons")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setPersonData(data);
        setIsLoading(false);
      });
  }, [])

  if (isLoading) {
    return (
      <div>...</div>
    )
  }

  return (
    <>
      <PersonModify />
      <Divider sx={{ mx: "Auto", width: "90%", my: 2 }} />
      <ReactDataTable direction="rtl" rows={personData} columns={columns} />
      <Modal isOpen={true} body={<Delete message="123 lkjl j kjl jlk lkjj jkjlkjlkj" onDelete={() => { }} />} title="" onCloseModal={() => { }} />
    </>
  )
}