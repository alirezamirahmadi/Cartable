"use client"

import { useEffect, useState } from "react";

import RoleModify from "@/components/role/roleModify";
import RoleTreeView from "@/components/role/roleTreeView";
import { RoleType } from "@/types/RoleType";
import Loading from "@/app/loading";

export default function Roles(): React.JSX.Element {

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [root, setRoot] = useState<string>("-1");
  const [role, setRole] = useState<RoleType>({ title: "", refPerson: "", root: "-1", isActive: false });

  useEffect(() => {
    loadRoleData();
  }, [])

  const handleSelectRole = (selectedRole: RoleType) => {
    setRoot(selectedRole._id ?? "-1");
    setRole(selectedRole);
  }

  const handleModify = (isModify: boolean) => {
    isModify && loadRoleData();
  }

  const loadRoleData = async () => {
    await fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => setRoles(data));
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        <RoleTreeView onSelectRole={handleSelectRole} roles={roles} />
        <RoleModify root={root} role={role} onModify={handleModify} />
      </div>
    </>
  )
}