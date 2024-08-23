"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import PersonModify from "@/components/person/personModify";
import { useTheme } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import { PersonType } from "@/types/personType";

const Modal = dynamic(() => import("@/components/general/modal/modal"));
const Snack = dynamic(() => import("@/components/general/snack/snack"));
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import type { SnackProps } from "@/types/generalType";

export default function PersonTable({ persons }: { persons: PersonType[] }): React.JSX.Element {

  const theme = useTheme();
  const router = useRouter();
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
        component: (value, onChange, rowData) => (<ModifyButtons rowData={rowData} onAction={handleAction} edit omit omitMessage={`آیا از حذف ${rowData?.firstName} مطمئن هستید؟`} />)
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
        handleDelete(data._id);
        break;
    }
  }

  const handleCloseModal = () => {
    setIsOpenEditModal(false);
  }

  const handleModify = (isModify: boolean) => {
    setIsOpenEditModal(false);
    if (isModify) {
      router.refresh();
      setSnackProps({ context: "تغییرات مورد نظر با موفقیت اعمال گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
    else {
      setSnackProps({ context: "عملیات مورد نظر با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  const handleDelete = async (personId: string) => {
    personId && await fetch(`api/v1/persons/${personId}`, {
      method: "DELETE"
    })
      .then(res => {
        res.status === 200 &&
          setSnackProps({ context: "شخص مورد نظر با موفقیت حذف گردید.", isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
      .then(() => router.refresh())
      .catch(() => {
        setSnackProps({ context: "عملیات حذف با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  return (
    <>
      <ReactDataTable direction="rtl" rows={persons} columns={columns} options={defaultDataTableOptions(theme.palette.mode)} />

      {snackProps.isOpen && <Snack {...snackProps} />}
      {isOpenEditModal && <Modal title="ویرایش شخص" isOpen={isOpenEditModal} fullWidth onCloseModal={handleCloseModal} body={<PersonModify person={rowData} onModify={handleModify} />} />}
    </>
  )
}