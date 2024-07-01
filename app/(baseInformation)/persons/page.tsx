
import PersonModify from "@/components/person/personModify";
import { Divider } from "@mui/material";
import ReactDataTable, { ColumnType } from "react-datatable-responsive";

export default function Persons(): React.JSX.Element {
  return (
    <>
      <PersonModify />
      <Divider sx={{ mx: "Auto", width: "90%", my: 2 }} />
      {/* <ReactDataTable /> */}
    </>
  )
}