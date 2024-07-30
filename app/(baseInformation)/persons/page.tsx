"use client"

import { useState, useEffect } from "react";
import PersonModify from "@/components/person/personModify";
import { Divider, useTheme } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import { PersonType } from "@/types/personType";

import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import Modal from "@/components/general/modal/modal";
import Snack from "@/components/general/snack/snack";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Loading from "@/components/general/loading/loading";
import type { SnackProps } from "@/types/generalType";

export default function Persons(): React.JSX.Element {

  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [personData, setPersonData] = useState<PersonType[]>([]);
  const [rowData, setRowData] = useState<PersonType>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  const columns: ColumnType[] = [
    { field: { title: "id" }, label: "ID", options: { display: false } },
    { field: { title: "firstName" }, label: "نام" },
    { field: { title: "lastName" }, label: "نام خانوادگی" },
    { field: { title: "code" }, label: "کد" },
    { field: { title: "isActive" }, label: "فعال", kind: "boolean" },
    { field: { title: "account.username" }, label: "نام کاربری" },
    {
      field: { title: "ویرایش" }, label: "ویرایش", kind: "component", options: {
        component: (value, onChange, rowData) => (<ModifyButtons rowData={rowData} onAction={handleAction} edit omit omitMessage={`آیا از حذف ${rowData?.firstName} مطمئن هستید؟`}/>)
      }
    },
  ]

  useEffect(() => {
    loadPersonData();
  }, [])

  const loadPersonData = async () => {
    setIsLoading(true);

    await fetch("api/v1/persons")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setPersonData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false))
  }

  const handleAction = (data: PersonType, action: string) => {
    setRowData(data);
    switch (action) {
      case "Edit":
        setIsOpenEditModal(true);
        break;
      case "Delete":
        handleDelete();
        break;
    }
  }

  const handleCloseModal = () => {
    setIsOpenEditModal(false);
  }

  const handleModify = (isModify: boolean) => {
    setIsOpenEditModal(false);
    if (isModify) {
      loadPersonData();
      setSnackProps({ context: "تغییرات مورد نظر با موفقیت اعمال گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
    else {
      setSnackProps({ context: "عملیات مورد نظر با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  const handleDelete = async () => {
    await fetch(`api/v1/persons/${rowData?._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 200) {
          loadPersonData();
          setSnackProps({ context: "شخص مورد نظر با موفقیت حذف گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
        }
      })
      .catch(() => {
        setSnackProps({ context: "عملیات حذف با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  if (isLoading) {
    return (
      <div className="mt-20">
        <Loading />
      </div>
    )
  }

  return (
    <>
      <PersonModify onModify={handleModify} />
      <Divider sx={{ mx: "Auto", width: "90%", my: 2 }} />
      <ReactDataTable direction="rtl" rows={personData} columns={columns} options={defaultDataTableOptions(theme.palette.mode)} />
      <Snack {...snackProps} />
      <Modal title="ویرایش شخص" isOpen={isOpenEditModal} fullWidth onCloseModal={handleCloseModal} body={<PersonModify onModify={handleModify} person={rowData} />} />
    </>
  )
}