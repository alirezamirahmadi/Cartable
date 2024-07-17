"use client"

import { useState, useEffect } from "react";
import { IconButton, useTheme, ListItemText } from "@mui/material";
import { useSearchParams } from "next/navigation";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts';

import TopBar from "@/components/cartable/inbox/topbar";
import SideBar from "@/components/cartable/sidebar";
import { Box } from "@mui/material";
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Buttons from "@/components/cartable/buttons";
import Modal from "@/components/general/modal/modal";
import Send from "@/components/cartable/send/send";

export default function Inbox(): React.JSX.Element {

  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collid");
  const [isOpenSendModal, setIsOpenSendModal] = useState<boolean>(false);

  const theme = useTheme();
  const [rows, setRows] = useState([]);

  const columns: ColumnType[] = [
    {
      field: { title: "observed" }, label: "", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <IconButton onClick={() => handleObserved(rowData)} disabled={value ? false : true}>
            {value ? <DraftsIcon fontSize="small" titleAccess="مشاهده شده (برای تغییر به مشاهده نشده کلیک کنید)" /> : <MailIcon fontSize="small" color="primary" titleAccess="مشاهده نشده" />}
          </IconButton>
        )
      }
    },
    { field: { title: "_id" }, label: "ID", options: { display: false } },
    {
      field: { title: "sender" }, label: "فرستنده", kind: "component", options: {
        component: (value, onChange, rowData) => (
          <ListItemText primary={`${rowData.sender.firstName} ${rowData.sender.lastName}`} secondary={rowData.role.title} />
        )
      }
    },
    { field: { title: "collection.showTitle" }, label: "نوع مدرک" },
    { field: { title: "urgency.title" }, label: "فوریت" },
    { field: { title: "send.sendDate" }, label: "تاریخ دریافت" },
    {
      field: { title: "Details" }, label: "", kind: "component", options: {
        component: (value, onChange, rowData) => (<Buttons value={value} onChange={(event: any) => onChange && onChange(event.target.value)} rowData={rowData} onAction={handleAction} />)
      }
    },
  ]

  useEffect(() => {
    collectionId && loadCollectionData();
  }, [collectionId])

  useEffect(() => {
    collectionId && loadCollectionData()
  }, [])

  const loadCollectionData = async () => {
    await fetch(`api/v1/cartable/inbox/${collectionId}`)
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setRows(data);
      })
  }

  const handleObserved = async (data: any) => {
    if (data.observed) {
      await fetch(`api/v1/receives/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ observed: false, viewDate: data.viewDate, lastViewedDate: data.lastViewedDate, })
      })
        .then(res => { res.status === 201 && loadCollectionData() })
    }
  }

  const handleAction = (data: any, action: string) => {
    switch (action) {
      case "Open":
        openDocument(data);
        break;
      case "Send":
        openSendModal();
        break;
      default:
        break;
    }
  }

  const openDocument = async (data: any) => {
    const today = new Date();

    await fetch(`api/v1/receives/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ observed: true, viewDate: data.viewDate ?? today, lastViewedDate: today, })
    })
      .then(res => { res.status === 201 && loadCollectionData() })
  }

  const openSendModal = () => {
    setIsOpenSendModal(true);
  }

  return (
    <>
      <div className="flex">
        <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 300 }}>
          <SideBar />
        </Box>
        <div className="w-full mx-2">
          <TopBar />
          <ReactDataTable rows={rows} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />
        </div>
      </div>
      <Modal isOpen={isOpenSendModal} title="ارسال مدرک" fullWidth body={<Send />} onCloseModal={() => setIsOpenSendModal(false)} />
    </>
  )
}

