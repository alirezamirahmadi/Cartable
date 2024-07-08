
import ReactDataTable, {ColumnType} from "react-datatable-responsive";

import TopBar from "@/components/cartable/inbox/topbar";
import SideBar from "@/components/cartable/sidebar";
import { Box } from "@mui/material";

export default function Inbox(): React.JSX.Element {

  
  // const columns: ColumnType[] = [
  //   { field: { title: "_id" }, label: "ID", options: { display: false } },
  //   { field: { title: "person.firstName" }, label: "فرستنده" },
  //   { field: { title: "collection.title" }, label: "نوع مدرک" },
  //   { field: { title: "isActive" }, label: "فوریت" },
  //   { field: { title: "account.username" }, label: "تاریخ دریافت" },
  // ]

  return (
    <>
      <TopBar />
      <Box sx={{display:{xs:"none", md:"block"}}}>
        <SideBar />
      </Box>
      {/* <ReactDataTable columns={columns}/> */}
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
