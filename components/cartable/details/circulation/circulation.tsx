"use client"

import { useState, useEffect } from "react";
import { ListItemText, Typography, useTheme } from "@mui/material";
import * as shamsi from "shamsi-date-converter";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";

import defaultDataTableOptions from "@/utils/defaultDataTable";

export default function Circulation({ refCollection, refDocument, onClose }: { refCollection: string, refDocument: string, onClose: () => void }): React.JSX.Element {

  const theme = useTheme();
  const [circulations, setCirculations] = useState();

  const columns: ColumnType[] = [
    { field: { title: "_id" }, label: "ID", options: { display: false } },
    {
      field: { title: "sender" }, label: "فرستنده", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <ListItemText primary={`${rowData.sender.firstName} ${rowData.sender.lastName}`} secondary={rowData.senderRole.title} />
        )
      }
    },
    {
      field: { title: "receiver" }, label: "گیرنده", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <ListItemText primary={`${rowData.receiver.firstName} ${rowData.receiver.lastName}`} secondary={rowData.receiverRole.title} />
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
  ]

  useEffect(() => {
    fetch(`api/v1/receives?refCollection=${refCollection}&refDocument=${refDocument}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setCirculations(data))
  }, [])

  return (
    <>
      <ReactDataTable rows={circulations ?? []} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />
    </>
  )
}