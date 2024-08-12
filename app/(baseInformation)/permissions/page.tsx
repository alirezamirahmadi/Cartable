"use client"

import { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";

import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import Roles from "@/components/role/roles";
import Snack from "@/components/general/snack/snack";
import type { SnackProps } from "@/types/generalType";
import type { RoleGroupType } from "@/types/generalType";
import type { PermissionType } from "@/types/permissionType";
import type { RoleType } from "@/types/RoleType";

export default function Permission(): React.JSX.Element {

  const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroupType | null>();
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [rolesPermission, setRolesPermission] = useState<RoleType[]>([]);
  const [snackProps, setSnackProps] = useState<SnackProps>();

  useEffect(() => {
    loadRolesPermission();
  }, [selectedPermission]);
  useEffect(() => {
    console.log(rolesPermission);
  }, [rolesPermission]);

  const loadRolesPermission = async () => {
    selectedPermission
      ?
      await fetch(`api/v1/rolePermissions/${selectedPermission._id}`)
        .then(res => res.status === 200 && res.json())
        .then(data => setRolesPermission(data.roles))
      :
      setRolesPermission([]);
  }

  const handleSelectRoleGroup = (roleGroup: RoleGroupType | null) => {
    setSelectedRoleGroup(roleGroup);
  }

  const handleSelectPermission = (permission: PermissionType) => {
    setSelectedPermission(permission);
  }

  const handleActionRoles = async (role: RoleType, action: string) => {
    selectedPermission && role && action === "Delete" &&
      await fetch(`api/v1/rolePermissions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({ roleId: role._id, permissionIds: [selectedPermission?._id] })
      })
        .then(res => {
          if (res.status === 200) {
            loadRolesPermission();
            setSnackProps({ context: `مجوز مورد نظر گرفته شد`, isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
          }
        })
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <PermissionTree roleGroup={selectedRoleGroup} onSelect={handleSelectPermission} />
        <Box sx={{ width: "100%" }}>
          <SelectRoleGroup onSelect={handleSelectRoleGroup} />
          <Divider variant="middle" sx={{ my: 2, mx: "auto" }} />
          <Roles roles={rolesPermission} omit onAction={handleActionRoles} />
        </Box>
      </Box>
      <Snack {...snackProps} />
    </>
  )
}