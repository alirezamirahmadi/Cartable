"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ListItemText, Typography, useTheme, IconButton, ListItem, ListItemAvatar, Avatar } from "@mui/material";
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import * as shamsi from "shamsi-date-converter";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";

const Modal = dynamic(() => import("@/components/general/modal/modal"));
const Snack = dynamic(() => import("@/components/general/snack/snack"));
import { useAppSelector } from "@/lib/hooks";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Delete from "@/components/general/delete/delete";
import RoleAvatar from "@/components/general/roleAvatar/roleAvatar";
import type { SnackProps } from "@/types/generalType";

export default function Circulation({ refCollection, refDocument }: { refCollection: string, refDocument: string }): React.JSX.Element {

  const theme = useTheme();
  const path = usePathname();
  const me = useAppSelector(state => state.me);
  const [circulations, setCirculations] = useState<any>();
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedCirculation, setSelectedCirculation] = useState<any>();

  const columns: ColumnType[] = [
    { field: { title: "_id" }, label: "ID", options: { display: false } },
    {
      field: { title: "sender" }, label: "فرستنده", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <RoleAvatar primary={`${rowData.sender.firstName} ${rowData.sender.lastName}`} secondary={rowData.senderRole.title} src={rowData.sender.image} />
        )
      }
    },
    {
      field: { title: "receiver" }, label: "گیرنده", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <RoleAvatar primary={`${rowData.receiver.firstName} ${rowData.receiver.lastName}`} secondary={rowData.receiverRole.title} src={rowData.receiver.image} />
        )
      }
    },
    { field: { title: "urgency.title" }, label: "فوریت" },
    { field: { title: "comment" }, label: "یادداشت" },
    {
      field: { title: "send.sendDate" }, label: "زمان دریافت", kind: "component", options: {
        component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{shamsi.gregorianToJalali(value).join("/")} {new Date(value).toLocaleTimeString()}</Typography>)
      }
    },
    {
      field: { title: "viewDate" }, label: "زمان مشاهده", kind: "component", options: {
        component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{value && `${shamsi.gregorianToJalali(value).join("/")} ${new Date(value).toLocaleTimeString()}`}</Typography>)
      }
    },
    {
      field: { title: "lastViewedDate" }, label: "زمان آخرین مشاهده", kind: "component", options: {
        component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{value && `${shamsi.gregorianToJalali(value).join("/")} ${new Date(value).toLocaleTimeString()}`}</Typography>)
      }
    },
    {
      field: { title: "observed" }, label: "", kind: "component", options: {
        component: (value, onChange, rowData) => {
          return !rowData.viewDate && path === "/outbox" && rowData.sender._id === me._id ? (
            <IconButton onClick={() => handleUndoSend(rowData)} color="primary">
              <LowPriorityIcon titleAccess="فراخوانی ارسال" />
            </IconButton>
          ) : (<></>)
        }
      }
    },
  ];

  useEffect(() => {
    loadReceiceData();
  }, []);

  const loadReceiceData = async () => {
    await fetch(`api/v1/receives?refCollection=${refCollection}&refDocument=${refDocument}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setCirculations(data))
  }

  const handleUndoSend = (data: any) => {
    setSelectedCirculation(data);
    setIsOpenDeleteModal(true);
  }

  const handleDeleteSend = async (isDelete: boolean) => {
    setIsOpenDeleteModal(false);

    isDelete && selectedCirculation && await fetch(`api/v1/receives/${selectedCirculation._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ refSend: selectedCirculation.refSend })
    })
      .then(res => {
        if (res.status === 200) {
          const tempCirculations = circulations?.filter((circulation: any) => circulation._id !== selectedCirculation._id);
          setCirculations(tempCirculations);
          setSnackProps({ context: "فراخوانی ارسال با موفقیت انجام شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
        }
      })
      .catch(() => {
        setSnackProps({ context: "مشکلی در فراخوانی ارسال وجود دارد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  if (!me.permissions.includes("/cartable.circulation")) {
    return (<></>)
  }

  return (
    <>
      <ReactDataTable rows={circulations ?? []} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />

      {snackProps.isOpen && <Snack {...snackProps} />}
      {isOpenDeleteModal && <Modal isOpen={isOpenDeleteModal} title="فراخوانی ارسال" body={<Delete message={`آیا از حذف ارسال مطمئن هستید؟`} onDelete={handleDeleteSend} />} onCloseModal={() => setIsOpenDeleteModal(false)} />}
    </>
  )
}