"use client"

import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";

import TopBar from "@/components/cartable/inbox/topbar";
import SideBar from "@/components/cartable/sidebar";
import { Box } from "@mui/material";
import Loading from "@/components/general/loading/loading";
import defaultDataTableOptions from "@/utils/defaultDataTable";

export default function Inbox(): React.JSX.Element {

  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collid");

  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const columns: ColumnType[] = [
    { field: { title: "_id" }, label: "ID" },
    { field: { title: "person.firstName" }, label: "فرستنده" },
    { field: { title: "collection.title" }, label: "نوع مدرک" },
    { field: { title: "urgency.title" }, label: "فوریت" },
    { field: { title: "send.sendDate" }, label: "تاریخ دریافت" },
  ]

  useEffect(() => {
    setIsLoading(true);
    collectionId && loadCollectionData();
  }, [collectionId])

  useEffect(() => {
    collectionId ? loadCollectionData() : setIsLoading(false);
  }, [])

  const loadCollectionData = async () => {
    await fetch(`api/v1/cartable/inbox/${collectionId}`)
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setIsLoading(false);
      }).
      catch(() => setIsLoading(false))
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
      <div className="flex">
        <Box sx={{ display: { xs: "none", md: "block" }, maxWidth:300 }}>
          <SideBar />
        </Box>
        <div className="w-full mx-2 shadow-md">
          <TopBar />
          <ReactDataTable rows={rows} columns={columns} direction="rtl" options={defaultDataTableOptions(theme.palette.mode)} />
        </div>
      </div>
    </>
  )
}

