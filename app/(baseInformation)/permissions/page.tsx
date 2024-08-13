"use client"

import { useState, useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";

import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import Roles from "@/components/role/roles";
import Groups from "@/components/group/groups";
import Snack from "@/components/general/snack/snack";
import type { SnackProps } from "@/types/generalType";
import type { RoleGroupType } from "@/types/generalType";
import type { PermissionType } from "@/types/permissionType";
import type { RoleType } from "@/types/RoleType";
import type { GroupType } from "@/types/groupType";

export default function Permission(): React.JSX.Element {

  const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroupType | null>();
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [rolesPermission, setRolesPermission] = useState<RoleType[]>([]);
  const [groupsPermission, setGroupsPermission] = useState<GroupType[]>([]);
  const [snackProps, setSnackProps] = useState<SnackProps>();

  useEffect(() => {
    Promise.all([
      loadGroupsPermission(),
      loadRolesPermission(),
    ])
  }, [selectedPermission]);

  const loadRolesPermission = async () => {
    selectedPermission
      ?
      await fetch(`api/v1/rolePermissions/${selectedPermission._id}`)
        .then(res => res.status === 200 && res.json())
        .then(data => setRolesPermission(data.roles))
      :
      setRolesPermission([]);
  }

  const loadGroupsPermission = async () => {
    selectedPermission
      ?
      await fetch(`api/v1/groupPermissions/${selectedPermission._id}`)
        .then(res => res.status === 200 && res.json())
        .then(data => setGroupsPermission(data))
      :
      setGroupsPermission([]);
  }

  const handleRolesAction = async (role: RoleType, action: string) => {
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

  const handleGroupsAction = async (group: GroupType, action: string) => {
    selectedPermission && group && action === "Delete" &&
      await fetch(`api/v1/groupPermissions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({ groupId: group._id, permissionIds: [selectedPermission._id] })
      })
        .then(res => {
          if (res.status === 200) {
            loadGroupsPermission();
            setSnackProps({ context: `مجوز مورد نظر گرفته شد`, isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
          }
        })
  }

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ px: 1, marginX: 1, border: "1px solid lightgray", borderRadius: 1.5 }}>
          <PermissionTree roleGroup={selectedRoleGroup} onSelect={(permission) => setSelectedPermission(permission)} />
        </Box>
        <Box>
          <SelectRoleGroup onSelect={(roleGroup) => setSelectedRoleGroup(roleGroup)} />
          <Divider variant="middle" sx={{ my: 2, mx: "auto" }} />
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ px: 1, border: "1px solid lightgray", borderRadius: 1.5 }}>
              <Typography variant="body1" sx={{ mt: 1 }}>سمت های دارای مجوز انتخاب شده</Typography>
              <Divider variant="middle" sx={{ my: 1, mx: "auto" }} />
              <Roles roles={rolesPermission} omit onAction={handleRolesAction} />
            </Box>
            <Box sx={{ px: 1, border: "1px solid lightgray", borderRadius: 1.5 }}>
              <Typography variant="body1" sx={{ mt: 1 }}>گروه های دارای مجوز انتخاب شده</Typography>
              <Divider variant="middle" sx={{ my: 1, mx: "auto" }} />
              <Groups groups={groupsPermission} omit onAction={handleGroupsAction} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Snack {...snackProps} />
    </>
  )
}