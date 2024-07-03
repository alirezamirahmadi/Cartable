"use client"

import { useState, useEffect } from "react";
import PersonModify from "@/components/person/personModify";
import { Divider, useTheme } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import { PersonType } from "@/types/PersonType";

import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import Modal from "@/components/general/modal/modal";
import Delete from "@/components/general/delete/delete";
import Snack from "@/components/general/snack/snack";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Loading from "@/components/general/loading/loading";
export default function Persons(): React.JSX.Element {

  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [personData, setPersonData] = useState<PersonType[]>([]);
  const [rowData, setRowData] = useState<PersonType>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenSnack, setIsOpenSnack] = useState<boolean>(false);
  const [snackContext, setSnackContext] = useState<string>("");

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
        setIsOpenDeleteModal(true);
        break;
    }
  }

  const handleCloseModal = () => {
    setIsOpenEditModal(false);
    setIsOpenDeleteModal(false);
  }

  const handleModify = (isModify: boolean) => {
    setIsOpenEditModal(false);
    if (isModify) {
      loadPersonData();
      setIsOpenSnack(true);
      setSnackContext("تغییرات ذخیره شد");
    }
  }

  const handleDelete = async (isDelete: boolean) => {
    setIsOpenDeleteModal(false);

    isDelete && await fetch(`api/v1/persons/${rowData?._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 200) {
          loadPersonData();
          setIsOpenSnack(true);
          setSnackContext("شخص مورد نظر حذف گردید.");
        }
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
      <Snack context={snackContext} isOpen={isOpenSnack} severity="success" onCloseSnack={() => setIsOpenSnack(false)} />
      <Modal title="ویرایش شخص" isOpen={isOpenEditModal} fullWidth onCloseModal={handleCloseModal} body={<PersonModify onModify={handleModify} person={rowData} />} />
      <Modal title="حذف شخص" isOpen={isOpenDeleteModal} onCloseModal={handleCloseModal} body={<Delete message={`آیا از حذف ${rowData?.firstName} مطمئن هستید؟`} onDelete={handleDelete} />} />
    </>
  )
}