"use client"

import { useState, useEffect } from "react";
import ReactDataTable, { ColumnType } from "react-datatable-responsive"
import { Box, useTheme, Typography } from "@mui/material";
import * as shamsi from "shamsi-date-converter";
import { useSearchParams } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";
import SideBar from "@/components/cartable/sidebar"
import defaultDataTableOptions from "@/utils/defaultDataTable";
import Buttons from "@/components/cartable/buttons";
import Modal from "@/components/general/modal/modal";
import Send from "@/components/cartable/send/send";
import Circulation from "@/components/cartable/details/circulation/circulation";
import TopBar from "@/components/cartable/inbox/topbar";

export default function Outbox(): React.JSX.Element {

  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collid");

  const theme = useTheme();
  const me = useAppSelector(state => state.me);
  const [documents, setDocuments] = useState([]);
  const [isOpenSendModal, setIsOpenSendModal] = useState<boolean>(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<any>();

  const columns: ColumnType[] = [
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

  useEffect(() => {
    loadCollectionData();
  }, [])

  useEffect(() => {
    loadCollectionData();
  }, [collectionId])

  const loadCollectionData = async () => {
    collectionId && me && await fetch(`api/v1/cartable/outbox/${collectionId}?roleId=${me.defaultRole._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setDocuments(data))
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

  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 300 }}>
          <SideBar place="outbox" />
        </Box>
        <Box sx={{ width: "100%", mx: 1 }}>
          <TopBar place="outbox" />
          <ReactDataTable rows={documents} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />
        </Box>
      </Box>
      <Modal isOpen={isOpenSendModal} title="ارسال مدرک" fullWidth body={<Send refCollection={collectionId ?? ""} refDocument={selectedDocument?.refDocument} parentReceive={selectedDocument?.parentReceive} onClose={() => setIsOpenSendModal(false)} />} onCloseModal={() => setIsOpenSendModal(false)} />
      <Modal isOpen={isOpenDetailsModal} title="گردش مدرک" fullWidth body={<Circulation refCollection={collectionId ?? ""} refDocument={selectedDocument?.refDocument} place="outbox" onClose={() => setIsOpenDetailsModal(false)} />} onCloseModal={() => setIsOpenDetailsModal(false)} />
    </>
  )
}