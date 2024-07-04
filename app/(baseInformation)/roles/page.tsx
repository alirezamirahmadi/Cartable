"use client"

import RoleModify from "@/components/role/roleModify";
import RoleTreeView from "@/components/role/roleTreeView";
import { RoleType } from "@/types/RoleType";

export default function Roles(): React.JSX.Element {

  const handleSelectRole = (role: RoleType) => {
    console.log(role);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        <RoleTreeView onSelectRole={handleSelectRole} />
        <RoleModify />
      </div>
    </>
  )
}