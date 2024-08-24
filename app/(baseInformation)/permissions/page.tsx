"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Divider, Typography } from "@mui/material";

const Snack = dynamic(() => import("@/components/general/snack/snack"));
import PermissionTree from "@/components/permission/permissionTree";
import SelectRoleGroup from "@/components/general/selectRoleGroup/selectRoleGroup";
import Roles from "@/components/role/roles";
import Groups from "@/components/group/groups";
import type { SnackProps } from "@/types/generalType";
import type { RoleGroupType } from "@/types/generalType";
import type { PermissionType } from "@/types/permissionType";
import type { RoleType } from "@/types/roleType";
import type { GroupType } from "@/types/groupType";

export default function Permission(): React.JSX.Element {

  const [selectedRoleGroup, setSelectedRoleGroup] = useState<RoleGroupType | null>();
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [rolesPermission, setRolesPermission] = useState<RoleType[]>([]);
  const [groupsPermission, setGroupsPermission] = useState<GroupType[]>([]);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

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
    switch (action) {
      case "Delete":
        selectedPermission && role && deleteRolePermission(role._id ?? "");
        break;
      case "SelectRole":
        selectedPermission && role && addRolePermission(role._id ?? "");
        break;
    }
  }

  const deleteRolePermission = async (roleId: string) => {
    await fetch(`api/v1/rolePermissions`, {
      method: "DELETE",
      body: JSON.stringify({ roleId: roleId, permissionIds: [selectedPermission?._id] })
    })
      .then(res => {
        if (res.status === 200) {
          loadRolesPermission();
          setSnackProps({ context: `مجوز مورد نظر گرفته شد`, isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
        }
      })
  }

  const addRolePermission = async (roleId: string) => {
    await fetch(`api/v1/rolePermissions`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ roleId, permissionIds: [selectedPermission?._id] })
    })
      .then(res => {
        if (res.status === 201) {
          loadRolesPermission();
          setSnackProps({ context: `مجوز مورد نظر داده شد`, isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
        }
      })
  }

  const handleGroupsAction = async (group: GroupType, action: string) => {
    switch (action) {
      case "Delete":
        selectedPermission && group && deleteGroupPermission(group._id ?? "");
        break;
      case "SelectGroup":
        selectedPermission && group && addGroupPermission(group._id ?? "");
        break;
    }
  }

  const deleteGroupPermission = async (groupId: string) => {
    await fetch(`api/v1/groupPermissions`, {
      method: "DELETE",
      body: JSON.stringify({ groupId: groupId, permissionIds: [selectedPermission?._id] })
    })
      .then(res => {
        if (res.status === 200) {
          loadGroupsPermission();
          setSnackProps({ context: `مجوز مورد نظر گرفته شد`, isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
        }
      })
  }

  const addGroupPermission = async (groupId: string) => {
    await fetch(`api/v1/groupPermissions`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ groupId, permissionIds: [selectedPermission?._id] })
    })
      .then(res => {
        if (res.status === 201) {
          loadGroupsPermission();
          setSnackProps({ context: `مجوز مورد نظر داده شد`, isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
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
              <Roles roles={rolesPermission} omit selectRole={selectedPermission && selectedPermission.kind !== 1 ? true : false} onAction={handleRolesAction} />
            </Box>
            <Box sx={{ px: 1, border: "1px solid lightgray", borderRadius: 1.5 }}>
              <Typography variant="body1" sx={{ mt: 1 }}>گروه های دارای مجوز انتخاب شده</Typography>
              <Divider variant="middle" sx={{ my: 1, mx: "auto" }} />
              <Groups groups={groupsPermission} omit selectGroup={selectedPermission && selectedPermission.kind !== 1 ? true : false} onAction={handleGroupsAction} />
            </Box>
          </Box>
        </Box>
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}