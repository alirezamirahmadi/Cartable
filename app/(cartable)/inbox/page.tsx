"use client"

import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";

import TopBar from "@/components/cartable/inbox/topbar";
import SideBar from "@/components/cartable/sidebar";
import { Box } from "@mui/material";
import Loading from "@/components/general/loading/loading";
import defaultDataTableOptions from "@/utils/defaultDataTable";

export default function Inbox(): React.JSX.Element {

  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const columns: ColumnType[] = [
    { field: { title: "_id" }, label: "ID", options: { display: false } },
    { field: { title: "person.firstName" }, label: "فرستنده" },
    { field: { title: "collection.title" }, label: "نوع مدرک" },
    { field: { title: "urgency.title" }, label: "فوریت" },
    { field: { title: "send.sendDate" }, label: "تاریخ دریافت" },
  ]

  useEffect(() => {
    fetch("api/v1/cartable/inbox/668cdfce72e7704b27400128")
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setIsLoading(false);
      });
  }, [])

  if (isLoading) {
    return (<div className="mt-20"><Loading /></div>)
  }

  return (
    <>
      <TopBar />
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <SideBar />
      </Box>
      <ReactDataTable rows={rows} columns={columns} options={defaultDataTableOptions(theme.palette.mode)} />
    </>
  )
}

// const extractData = (row: any, fileld: string) => {
//   const subField = fileld.split(".");

//   switch (subField.length) {
//     case 1:
//       return row[subField[0]];
//     case 2:
//       return row[subField[0]][subField[1]];
//     case 3:
//       return row[subField[0]][subField[1]][subField[2]];
//     case 4:
//       return row[subField[0]][subField[1]][subField[2]][subField[3]];
//     case 5:
//       return row[subField[0]][subField[1]][subField[2]][subField[3]][subField[4]];
//     case 6:
//       return row[subField[0]][subField[1]][subField[2]][subField[3]][subField[4]][subField[5]];
//   }
// }
