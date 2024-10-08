"use client"

import { useState, useEffect, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ListItem, ListItemText, ListItemButton, List, Box, IconButton, Checkbox,
  Breadcrumbs, Button, Collapse, Tooltip
} from "@mui/material";
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';

const Snack = dynamic(() => import("@/components/general/snack/snack"));
import Loading from "../general/loading/loading";
import ModifyButtons from "../general/modifyButtons/modifyButtons";
import TreeActions from "../general/treeActions/treeActions";
import RolesGroups from "./rolesGroups";
import { useAppSelector } from "@/lib/hooks";
import type { SnackProps } from "@/types/generalType";
import type { PermissionType } from "@/types/permissionType";

export default function PermissionTree({ permissions, permissionsByGroups, oldPermissions }:
  { permissions: PermissionType[], permissionsByGroups: string[], oldPermissions: string[] }): React.JSX.Element {

  const me = useAppSelector(state => state.me);
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleId = searchParams.get("roleId");
  const groupId = searchParams.get("groupId");
  const [permissionsList, setPermissionsList] = useState<PermissionType[]>([]);
  const [permissionItems, setPermissionItems] = useState<PermissionType[]>([]);
  const [roots, setRoots] = useState<PermissionType[]>([{ _id: null, title: "", showTitle: "خانه", root: "-1", kind: 1 }])
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [openPermissionItems, setopenPermissionItems] = useState<string>("");
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });

  const loadPermissionList = (searchContent?: string) => {
    setPermissionsList([...permissions].filter((permission: PermissionType) => !searchContent ? permission.root === roots[roots.length - 1]._id : permission.title.includes(searchContent ?? "")))
  }

  useMemo(() => {
    loadPermissionList();
  }, [roots, permissions]);

  useEffect(() => {
    setNewPermissions(oldPermissions ?? []);
  }, [oldPermissions]);

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
        setopenPermissionItems((openPermissionItems === permission._id || !permission._id) ? "" : permission._id);
        setPermissionItems([...permissions].filter((permissionItem: PermissionType) => permissionItem.root === permission._id));
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
    if (!roleId && !groupId) {
      setSnackProps({ context: "لطفا گروه و یا سمت مورد نظر را انتخاب کنید", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      return;
    }

    if (action === "Save") {
      addNewPermissons()
        .then(() => deleteTakenPermissons()
          .then(() => {
            router.refresh();
            setSnackProps({ context: `مجوزهای مورد نظر اعمال شد`, isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
          })
        )
        .catch(() => {
          setSnackProps({ context: "ذخیره مجوزها با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
        })
    }
  }

  const addNewPermissons = async () => {
    const permissionIds: string[] = [...newPermissions].filter((permission: string) => !oldPermissions?.includes(permission));

    permissionIds.length > 0 && await fetch(`api/v1/${roleId ? "rolePermissions" : "groupPermissions"}`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(roleId ? { roleId, permissionIds } : { groupId, permissionIds })
    })
  }

  const deleteTakenPermissons = async () => {
    const permissionIds: string[] = [...oldPermissions ?? []].filter((permission: string) => !newPermissions?.includes(permission));

    permissionIds.length > 0 && await fetch(`api/v1/${roleId ? "rolePermissions" : "groupPermissions"}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(roleId ? { roleId, permissionIds } : { groupId, permissionIds })
    })
  }

  const handleTreeAction = (root: any[], action: string, searchContent: string | undefined) => {
    switch (action) {
      case "Search":
        setPermissionsList([...permissions].filter((permission: PermissionType) => permission.showTitle.includes(searchContent ?? "")))
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
            {permissionsList.map((permission: PermissionType) => (
              <Box key={permission._id}>
                <ListItem sx={{ py: 0, minHeight: 24 }}>
                  <IconButton sx={{ px: 0 }} onClick={() => handleSubPermission(permission)} disabled={permission.kind === 3}>
                    {permission.kind === 1 && <RuleFolderIcon />}
                    {permission.kind === 2 && openPermissionItems === permission._id && <ExpandLess />}
                    {permission.kind === 2 && openPermissionItems !== permission._id && <ExpandMore />}
                  </IconButton>
                  {permission.kind !== 1 && <Checkbox checked={newPermissions.includes(permission._id ?? "")} onChange={() => handleToggle(permission._id ?? "")} />}
                  <ListItemButton sx={{ py: 0, px: 1 }} selected={selectedPermission?._id === permission._id} onClick={() => setSelectedPermission(permission)}>
                    <ListItemText primary={permission.showTitle} />
                  </ListItemButton>
                  {permissionsByGroups.includes(permission._id ?? "") && <Tooltip title="داشتن مجوز با عضویت در گروه"><GroupIcon fontSize="small" /></Tooltip>}
                </ListItem>
                {permission.kind === 2 &&
                  <Collapse in={openPermissionItems === permission._id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {permissionItems.map((permissionItem: PermissionType) => (
                        <ListItem key={permissionItem._id} sx={{ py: 0, pl: 7, maxHeight: 28 }}>
                          <Checkbox checked={newPermissions.includes(permissionItem._id ?? "")} onChange={() => handleToggle(permissionItem._id ?? "")} />
                          <ListItemButton sx={{ py: 0, px: 1 }} selected={selectedPermission?._id === permissionItem._id} onClick={() => setSelectedPermission(permissionItem)}>
                            <ListItemText secondary={permissionItem.showTitle} />
                          </ListItemButton>
                          {permissionsByGroups.includes(permissionItem._id ?? "") && <Tooltip title="داشتن مجوز با عضویت در گروه"><GroupIcon fontSize="small" /></Tooltip>}
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                }
              </Box>
            ))}
          </List>
        </Box >
        <Suspense fallback={<Loading />}>
          <RolesGroups selectedPermission={selectedPermission} />
        </Suspense>
      </Box>

      {snackProps.isOpen && <Snack {...snackProps} />}
    </>
  )
}