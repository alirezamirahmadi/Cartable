"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import PersonModify from "@/components/person/personModify";
import { useTheme, Avatar } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";

import Loading from "../general/loading/loading";
const Modal = dynamic(() => import("@/components/general/modal/modal"), { loading: () => <Loading /> });
const Snack = dynamic(() => import("@/components/general/snack/snack"));
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import { useAppSelector } from "@/lib/hooks";
import type { SnackProps } from "@/types/generalType";
import type { PersonType } from "@/types/personType";

export default function PersonTable({ persons }: { persons: PersonType[] }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const theme = useTheme();
  const router = useRouter();
  const [rowData, setRowData] = useState<PersonType>();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  const columns: ColumnType[] = [
    { field: { title: "id" }, label: "ID", options: { display: false } },
    {
      field: { title: "avatar" }, label: "تصویر", kind: "component", options: {
        component: (value, onChange, rowData) => (<Avatar sx={{ mx: "auto" }} alt={rowData.firstName} src={value} />)
      }
    },
    { field: { title: "fullName" }, label: "نام و نام خانوادگی" },
    { field: { title: "code" }, label: "کد" },
    { field: { title: "isActive" }, label: "فعال", kind: "boolean" },
    { field: { title: "account.username" }, label: "نام کاربری" },
    {
      field: { title: "ویرایش" }, label: "ویرایش", kind: "component", options: {
        component: (value, onChange, rowData) => (<ModifyButtons rowData={rowData} onAction={handleAction} edit={me.permissions.includes("/persons.edit")} omit={me.permissions.includes("/persons.delete")} omitMessage={`آیا از حذف ${rowData?.firstName} مطمئن هستید؟`} />)
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
        switch (res.status) {
          case 200:
            setSnackProps({ context: "شخص مورد نظر با موفقیت حذف گردید.", isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
            break;
          case 403:
            setSnackProps({ context: "شخض مورد نظر به دلیل استفاده شدن در سمت ها، ارسال و یا دریافت قابل حذف نیست", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
            break;
        }
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
      {isOpenEditModal && <Modal title="ویرایش شخص" isOpen={isOpenEditModal} fullWidth onCloseModal={() => setIsOpenEditModal(false)} body={<PersonModify person={rowData} onModify={handleModify} />} />}
    </>
  )
}