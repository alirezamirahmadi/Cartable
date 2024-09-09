"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import { IconButton, useTheme, ListItemText, TextField, Button, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CloseIcon from '@mui/icons-material/Close';

import Loading from "@/components/general/loading/loading";
const Snack = dynamic(() => import("@/components/general/snack/snack"));
const Roles = dynamic(() => import("../../role/roles"), { loading: () => <Loading /> });
import { useAppSelector } from "@/lib/hooks";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Urgency from "../urgency/urgency";
import type { ReceiverType, UrgencyType, ReceiveType } from "@/types/cartableType";
import type { SnackProps } from "@/types/generalType";
import type { RoleType } from "@/types/roleType";

export default function Send({ refCollection, refDocument, parentReceive, onClose }: { refCollection: string, refDocument: string, parentReceive: string, onClose: () => void }): React.JSX.Element {

  const theme = useTheme();

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [receivers, setReceivers] = useState<ReceiverType[]>();
  const [deleteReceiver, setDeleteReceiver] = useState<ReceiverType>();
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const me = useAppSelector(state => state.me);

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
    loadRoleData();
  }, [])

  useEffect(() => {
    if (receivers) {
      let tempReceivers: ReceiverType[] = receivers.filter((receiver: ReceiverType) => receiver.role._id !== deleteReceiver?.role._id);
      setReceivers(tempReceivers);
    }
  }, [deleteReceiver])

  const loadRoleData = async () => {
    await fetch(`api/v1/roles/myConnections?roleId=${me.defaultRole._id}&root=${me.defaultRole.root}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setRoles(data))
  }

  const handleChangeUrgency = (value: UrgencyType, rowData: ReceiverType) => {
    rowData.urgency = value;
  }

  const handleChangeComment = (value: any, rowData: ReceiverType) => {
    rowData.comment = value;
  }

  const handleDeleteReceiver = (rowData: any) => {
    setDeleteReceiver(rowData);
  }

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

  const handleSubmit = async () => {

    await fetch("api/v1/sends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refPerson: me._id, refRole: me.defaultRole._id, refCollection, refDocument, sendDate: new Date(), parentReceive })
    })
      .then(res => res.status === 201 && res.json())

      .then(async (data) => {
        let receiverList: ReceiveType[] = [];
        receivers?.map((receiver: ReceiverType) => {
          receiverList.push({ refSend: data._id, refPerson: receiver.person._id, refRole: receiver.role._id, refUrgency: receiver.urgency._id, viewDate: null, lastViewedDate: null, comment: receiver.comment, observed: false })
        })
        await fetch("api/v1/receives", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json"
          },
          body: JSON.stringify(receiverList)
        })
          .then(res => res.status === 201 && onClose())
          .catch(() => {
            setSnackProps({ context: "ارسال مدرک با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
          })
      })

      .catch(() => {
        setSnackProps({ context: "ارسال مدرک با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Roles roles={roles} onAction={handleSelectRole} add />
        <Box sx={{ width: "100%" }} className="w-full">
          <ReactDataTable rows={receivers ?? []} columns={columns} direction="rtl"
            options={{ ...defaultDataTableOptions(theme.palette.mode), filter: false, search: false, download: false, viewColumns: false, print: false }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", columnGap: 2 }} className="flex justify-center gap-x-4">
        <Button variant="outlined" color="primary" onClick={() => onClose()} startIcon={<CloseIcon />}>انصراف</Button>
        <Button variant="contained" color="primary" disabled={receivers && receivers.length > 0 ? false : true} onClick={handleSubmit} startIcon={<KeyboardArrowUpOutlinedIcon />}>ارسال</Button>
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}