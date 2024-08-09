"use client"

import PermissionTree from "@/components/permission/permissionTree";


export default function Permission(): React.JSX.Element {

  const handleSavePermissions = (permissionIds: string[]) => {
    console.log(permissionIds);
  }

  return (
    <>
      <PermissionTree onSave={handleSavePermissions} />
    </>
  )
}