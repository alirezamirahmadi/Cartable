"use client"

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import { RoleGroupType } from "@/types/generalType";

export default function Permission(): React.JSX.Element {

  const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroupType | null>();

  const handleSelectRoleGroup = (roleGroup: RoleGroupType | null) => {
    setSelectedRoleGroup(roleGroup);
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <PermissionTree roleGroup={selectedRoleGroup} />
        <Box>
          <SelectRoleGroup onSelect={handleSelectRoleGroup} />
        </Box>
      </Box>
    </>
  )
}