"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ListItem, ListItemText, ListItemButton, List, Box, IconButton, Checkbox,
  Breadcrumbs, Button, Collapse, Tooltip
} from "@mui/material";
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';

const Snack = dynamic(() => import("@/components/general/snack/snack"));
import ModifyButtons from "../general/modifyButtons/modifyButtons";
import TreeActions from "../general/treeActions/treeActions";
import RolesGroups from "./rolesGroups";
import { useAppSelector } from "@/lib/hooks";
import type { SnackProps } from "@/types/generalType";
import type { PermissionType } from "@/types/permissionType";
import type { RoleGroupType } from "@/types/generalType";

export default function PermissionTree({ roleGroup }: { roleGroup?: RoleGroupType | null }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [permissionItems, setPermissionItems] = useState<PermissionType[]>([]);
  const [roots, setRoots] = useState<PermissionType[]>([{ _id: "null", title: "", showTitle: "خانه", root: "-1", kind: 1 }])
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [oldPermissions, setOldPermissions] = useState<string[]>([]);
  const [roleInGroupsPermissions, setRoleInGroupsPermissions] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [openPermissionItems, setopenPermissionItems] = useState<string>("");
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  useEffect(() => {
    loadPermissionByRoot();
  }, []);

  useEffect(() => {
    loadPermissionByRoot();
  }, [roots]);

  useEffect(() => {
    setNewPermissions(oldPermissions ?? []);
  }, [oldPermissions]);

  useEffect(() => {
    roleGroup !== undefined && Promise.all([
      loadRoleGroupPermission(),
      loadRoleInGroupPermission(),
    ])
  }, [roleGroup]);

  const loadRoleInGroupPermission = async () => {
    roleGroup?.kind === 1 ?
      await fetch(`api/v1/groupPermissions?roleId=${roleGroup._id}`)
        .then(res => res.status === 200 && res.json())
        .then(data => {
          const tempPermissions: string[] = [];
          data.map((groupPermission: any) => {
            tempPermissions.push(...groupPermission.permissions)
          })
          setRoleInGroupsPermissions(tempPermissions);
        })
      :
      setRoleInGroupsPermissions([]);
  }

  const loadRoleGroupPermission = async () => {
    roleGroup ?
      await fetch(`api/v1/${roleGroup?.kind === 1 ? "rolePermissions?roleId" : "groupPermissions?groupId"}=${roleGroup?._id}`)
        .then(res => res.status === 200 && res.json())
        .then(data => setOldPermissions(data[0]?.permissions))
      :
      setOldPermissions([]);
  }

  const loadPermissionByRoot = async () => {
    await fetch(`api/v1/permissions/${roots[roots.length - 1]._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setPermissions(data));
  }

  const loadPermissionByShowTitle = async (searchContent: string) => {
    await fetch(`api/v1/permissions?showTitle=${searchContent}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setPermissions(data));
  }

  const loadPermissionItems = async (permissionId: string) => {
    await fetch(`api/v1/permissions/${permissionId}?item=true`)
      .then(res => res.status === 200 && res.json())
      .then(data => setPermissionItems(data));
  }

  const handleToggle = (permissionId: string) => {
    const index = newPermissions.indexOf(permissionId);
    const tempChecked = [...newPermissions]
    index === -1 ? tempChecked.push(permissionId) : tempChecked.splice(index, 1);
    setNewPermissions(tempChecked);
  }

  const handleSubPermission = (permission: PermissionType) => {
    setSelectedPermission(undefined);

    switch (permission.kind) {
      case 1:
        setRoots([...roots, permission]);
        break;
      case 2:
        setopenPermissionItems(openPermissionItems === permission._id ? "" : permission._id);
        loadPermissionItems(permission._id);
        break;
    }
  }

  const handleBreadcrumbs = (root: PermissionType) => {
    setSelectedPermission(undefined);

    const tempRoots: PermissionType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);

    setRoots(tempRoots);
  }

  const handleSaveAction = (data: any, action: string) => {
    if (!roleGroup) {
      setSnackProps({ context: "لطفا گروه و یا سمت مورد نظر را انتخاب کنید", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      return;
    }

    if (action === "Save") {
      addNewPermissons()
        .then(() => deleteTakenPermissons()
          .then(() => {
            loadRoleGroupPermission();
            setSnackProps({ context: `مجوزهای مورد نظر برای ${roleGroup?.title} اعمال شد`, isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
          })
        )
        .catch(() => {
          setSnackProps({ context: "ذخیره مجوزها با خطا موچه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
        })
    }
  }

  const addNewPermissons = async () => {
    const permissionIds: string[] = [...newPermissions].filter((permission: string) => !oldPermissions?.includes(permission));

    permissionIds.length > 0 && await fetch(`api/v1/${roleGroup?.kind === 1 ? "rolePermissions" : "groupPermissions"}`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(roleGroup?.kind === 1 ? { roleId: roleGroup?._id, permissionIds } : { groupId: roleGroup?._id, permissionIds })
    })
  }

  const deleteTakenPermissons = async () => {
    const permissionIds: string[] = [...oldPermissions ?? []].filter((permission: string) => !newPermissions?.includes(permission));

    permissionIds.length > 0 && await fetch(`api/v1/${roleGroup?.kind === 1 ? "rolePermissions" : "groupPermissions"}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(roleGroup?.kind === 1 ? { roleId: roleGroup?._id, permissionIds } : { groupId: roleGroup?._id, permissionIds })
    })
  }

  const handleTreeAction = (root: any[], action: string, searchContent: string | undefined) => {
    switch (action) {
      case "Search":
        loadPermissionByShowTitle(searchContent ?? "");
        break;
      case "Reset":
        setRoots(root);
        break;
      case "Backward":
        setRoots(root);
        break;
    }
  }

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 1, rowGap: 1 }}>
        <Box sx={{ width: '100%', maxWidth: 356, bgcolor: 'background.paper', py: 1, border: "1px solid lightgray", borderRadius: 1.5 }}>
          <Breadcrumbs>
            {roots.length > 1 && roots.map((root: PermissionType, index) => (
              <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.showTitle}</Button>
            ))}
          </Breadcrumbs>
          {me.permissions.includes("/permissions.edit") &&
            <Box sx={{ display: "flex" }}>
              <ModifyButtons save onAction={handleSaveAction} />
            </Box>
          }
          <List component="nav" sx={{ py: 0 }}>
            <ListItem component="div" disablePadding sx={{ px: 1, pb: 1 }}>
              <TreeActions roots={roots} search reset backward onAction={handleTreeAction} />
            </ListItem>
            {permissions.map((permission: PermissionType) => (
              <Box key={permission._id}>
                <ListItem sx={{ py: 0, minHeight: 24 }}>
                  <IconButton sx={{ px: 0 }} onClick={() => handleSubPermission(permission)} disabled={permission.kind === 3}>
                    {permission.kind === 1 && <RuleFolderIcon />}
                    {permission.kind === 2 && openPermissionItems === permission._id && <ExpandLess />}
                    {permission.kind === 2 && openPermissionItems !== permission._id && <ExpandMore />}
                  </IconButton>
                  {permission.kind !== 1 && <Checkbox checked={newPermissions.includes(permission._id)} onChange={() => handleToggle(permission._id)} />}
                  <ListItemButton sx={{ py: 0, px: 1 }} selected={selectedPermission?._id === permission._id} onClick={() => setSelectedPermission(permission)}>
                    <ListItemText primary={permission.showTitle} />
                  </ListItemButton>
                  {roleInGroupsPermissions.includes(permission._id) && <Tooltip title="داشتن مجوز با عضویت در گروه"><GroupIcon fontSize="small" /></Tooltip>}
                </ListItem>
                {permission.kind === 2 &&
                  <Collapse in={openPermissionItems === permission._id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {permissionItems.map((permissionItem: PermissionType) => (
                        <ListItem key={permissionItem._id} sx={{ py: 0, pl: 7, maxHeight: 28 }}>
                          <Checkbox checked={newPermissions.includes(permissionItem._id)} onChange={() => handleToggle(permissionItem._id)} />
                          <ListItemButton sx={{ py: 0, px: 1 }} selected={selectedPermission?._id === permissionItem._id} onClick={() => setSelectedPermission(permissionItem)}>
                            <ListItemText secondary={permissionItem.showTitle} />
                          </ListItemButton>
                          {roleInGroupsPermissions.includes(permissionItem._id) && <Tooltip title="داشتن مجوز با عضویت در گروه"><GroupIcon fontSize="small" /></Tooltip>}
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                }
              </Box>
            ))}
          </List>
        </Box >
        <RolesGroups selectedPermission={selectedPermission} />
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}