"use client"

import ReactDataTable, {ColumnType} from "react-datatable-responsive"
import SideBar from "@/components/cartable/sidebar"

export default function Outbox(): React.JSX.Element {
  return (
    <>
    <div className="flex">
      <SideBar place="outbox" />

    </div>
    </>
  )
}