"use client"

import { useState, useEffect, ChangeEvent } from "react";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import { IconButton, useTheme, ListItemText, TextField, Select, MenuItem, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

import SideBar from "./sidebar";
import { RoleType } from "@/types/roleType";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import type { ReceiverType, UrgencyType } from "@/types/cartableType";
import Urgency from "../urgency/urgency";

export default function Send(): React.JSX.Element {

  const theme = useTheme();

  const [receivers, setReceivers] = useState<ReceiverType[]>();
  const [deleteReceiver, setDeleteReceiver] = useState<ReceiverType>();

  const columns: ColumnType[] = [
    { field: { title: "_id" }, label: "ID", options: { display: false } },
    {
      field: { title: "person" }, label: "گیرنده", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <ListItemText primary={rowData.person.name} secondary={rowData.role.title} sx={{ cursor: "pointer" }} />
        )
      }
    },
    {
      field: { title: "urgency" }, label: "فوریت", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <Urgency defaultValue={rowData.urgency} onChange={(value: UrgencyType) => handleChangeUrgency(value, rowData)} />
        )
      }
    },
    {
      field: { title: "comment" }, label: "یادداشت", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <TextField value={value} onChange={event => onChange && onChange(event.target.value)} size="small" variant="outlined" multiline onBlur={event => handleChangeComment(event.target.value, rowData)} />
        )
      }
    },
    {
      field: { title: "observed" }, label: "", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <IconButton onClick={() => handleDeleteReceiver(rowData)} color="error">
            <DeleteIcon fontSize="small" titleAccess="حذف" />
          </IconButton>
        )
      }
    },
  ]

  useEffect(() => {
    if (receivers) {
      let tempReceivers: ReceiverType[] = receivers.filter((receiver: ReceiverType) => receiver.role._id !== deleteReceiver?.role._id);
      setReceivers(tempReceivers);
    }
  }, [deleteReceiver])

  const handleChangeUrgency = (value: UrgencyType, rowData: ReceiverType) => {
    rowData.urgency = value;
  }

  const handleChangeComment = (value: any, rowData: ReceiverType) => {
    rowData.comment = value;
  }

  const handleDeleteReceiver = (rowData: any) => {
    setDeleteReceiver(rowData);
  }
  console.log(receivers);
  

  const handleSelectRole = (role: any) => {
    if (!receivers?.some((receiver: ReceiverType) => receiver.role._id === role._id)) {
      let tempReceivers: ReceiverType[] = [...receivers ?? []];
      tempReceivers.push(
        {
          person: { _id: role.person?._id, name: `${role.person?.firstName} ${role.person.lastName}` },
          role: { _id: role._id, title: role.title },
          urgency: { _id: "", title: "" },
          comment: "",
        })
      setReceivers(tempReceivers);
    }
  }

  const handleSubmit = () => {
console.log(receivers);
  }

  return (
    <>
      <div className="flex">
        <SideBar onSelect={handleSelectRole} />
        <div className="w-full">
          <ReactDataTable rows={receivers ?? []} columns={columns} direction="rtl"
            options={{ ...defaultDataTableOptions(theme.palette.mode), filter: false, search: false, download: false, viewColumns: false, print: false }}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<KeyboardArrowUpOutlinedIcon />}>ارسال</Button>
      </div>
    </>
  )
}