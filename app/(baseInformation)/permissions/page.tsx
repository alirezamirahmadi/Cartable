"use client"

import Box from "@mui/material/Box";

import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import { RoleGroupType } from "@/types/generalType";

export default function Permission(): React.JSX.Element {

  const handleSavePermissions = (permissionIds: string[]) => {
    console.log(permissionIds);
  }

  const handleSelectRoleGroup = (roleGroup: RoleGroupType | null) => {
    console.log(roleGroup);
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <PermissionTree onSave={handleSavePermissions} />
        <Box>
          <SelectRoleGroup onSelect={handleSelectRoleGroup} />
        </Box>
      </Box>
    </>
  )
}