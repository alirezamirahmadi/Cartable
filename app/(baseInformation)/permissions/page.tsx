"use client"

import { useState } from "react";
import { Box } from "@mui/material";

import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import type { RoleGroupType } from "@/types/generalType";

export default function Permission(): React.JSX.Element {

  const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroupType | null>();

  return (
    <>
      <Box sx={{ marginX: 1, }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SelectRoleGroup onSelect={(roleGroup) => setSelectedRoleGroup(roleGroup)} />
        </Box>
        <Box sx={{ px: 1, mt: 1 }}>
          <PermissionTree roleGroup={selectedRoleGroup} />
        </Box>
      </Box>
    </>
  )
}