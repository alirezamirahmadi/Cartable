"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { IconButton, useTheme, ListItemText, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";
import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts';
import * as shamsi from "shamsi-date-converter";

const Modal = dynamic(() => import("@/components/general/modal/modal"));
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Buttons from "@/components/cartable/buttons/buttons";
import Send from "@/components/cartable/send/send";
import Circulation from "@/components/cartable/details/circulation/circulation";

export default function DocumentList({ documents, place }: { documents: any[], place: "inbox" | "outbox" }): React.JSX.Element {

  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");
  const [isOpenSendModal, setIsOpenSendModal] = useState<boolean>(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<any>();

  const router = useRouter();
  const theme = useTheme();

  const columns: ColumnType[] =
    place === "inbox"
      ?
      [
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
              <ListItemText primary={`${rowData.sender.firstName} ${rowData.sender.lastName}`} secondary={rowData.senderRole.title} />
            )
          }
        },
        { field: { title: "send.refDocument" }, label: "شماره مدرک" },
        { field: { title: "collection.showTitle" }, label: "نوع مدرک" },
        { field: { title: "urgency.title" }, label: "فوریت" },
        {
          field: { title: "send.sendDate" }, label: "زمان دریافت", kind: "component", options: {
            component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{shamsi.gregorianToJalali(value).join("/")} {new Date(value).toLocaleTimeString()}</Typography>)
          }
        },
        {
          field: { title: "Details" }, label: "", kind: "component", options: {
            component: (value, onChange, rowData) => (<Buttons value={value} onChange={(event: any) => onChange && onChange(event.target.value)} rowData={rowData} onAction={handleAction} />)
          }
        },
      ]

      :

      [
        { field: { title: "_id" }, label: "ID", options: { display: false } },
        { field: { title: "refDocument" }, label: "شماره مدرک" },
        { field: { title: "collection.showTitle" }, label: "نوع مدرک" },
        {
          field: { title: "sendDate" }, label: "زمان ارسال", kind: "component", options: {
            component: (value, onChange, rowData) => (<Typography variant="body2" sx={{ direction: "rtl" }}>{shamsi.gregorianToJalali(value).join("/")} {new Date(value).toLocaleTimeString()}</Typography>)
          }
        },
        {
          field: { title: "Details" }, label: "", kind: "component", options: {
            component: (value, onChange, rowData) => (<Buttons value={value} onChange={(event: any) => onChange && onChange(event.target.value)} rowData={rowData} onAction={handleAction} />)
          }
        },
      ]

  const handleObserved = async (data: any) => {
    if (data.observed) {
      await fetch(`api/v1/receives/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ observed: false, viewDate: data.viewDate, lastViewedDate: data.lastViewedDate, })
      })
        .then(res => { res.status === 201 && router.refresh() })
    }
  }

  const handleAction = (data: any, action: string) => {
    setSelectedDocument(data);

    switch (action) {
      case "Open":
        openDocument(data);
        break;
      case "Send":
        setIsOpenSendModal(true);
        break;
      case "Details":
        setIsOpenDetailsModal(true);
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
      .then(res => { res.status === 201 && router.refresh() })
  }

  return (
    <>
      <ReactDataTable rows={documents} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />

      {isOpenSendModal && <Modal isOpen={isOpenSendModal} title="ارسال مدرک" fullWidth body={<Send refCollection={collectionId ?? ""} refDocument={place === "inbox" ? selectedDocument?.send?.refDocument : selectedDocument?.refDocument} parentReceive={selectedDocument?._id} onClose={() => setIsOpenSendModal(false)} />} onCloseModal={() => setIsOpenSendModal(false)} />}
      {isOpenDetailsModal && <Modal isOpen={isOpenDetailsModal} title="گردش مدرک" fullWidth body={<Circulation refCollection={collectionId ?? ""} refDocument={place === "inbox" ? selectedDocument?.send?.refDocument : selectedDocument?.refDocument} place="inbox" onClose={() => setIsOpenDetailsModal(false)} />} onCloseModal={() => setIsOpenDetailsModal(false)} />}
    </>
  )
}

