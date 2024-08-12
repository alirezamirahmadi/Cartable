"use client"

import { useState, useEffect } from "react";
import {
  ListItem, ListItemText, ListItemButton, List, Box, IconButton, Checkbox, TextField, Typography,
  Breadcrumbs, Button, Collapse
} from "@mui/material";
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import CachedIcon from "@mui/icons-material/Cached";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import ModifyButtons from "../general/modifyButtons/modifyButtons";
import Snack from "../general/snack/snack";
import { SnackProps } from "@/types/generalType";
import type { PermissionType } from "@/types/permissionType";
import type { RoleGroupType } from "@/types/generalType";

export default function PermissionTree({ roleGroup, onSelect }: { roleGroup?: RoleGroupType | null, onSelect: (permission: PermissionType) => void }): React.JSX.Element {

  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [permissionItems, setPermissionItems] = useState<PermissionType[]>([]);
  const [roots, setRoots] = useState<PermissionType[]>([{ _id: "null", title: "", showTitle: "خانه", root: "null", kind: 1 }])
  const [search, setSearch] = useState<string>("");
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [oldPermissions, setOldPermissions] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [openPermissionItems, setopenPermissionItems] = useState<string>("");
  const [snackProps, setSnackProps] = useState<SnackProps>();

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
    loadOldPermission();
  }, [roleGroup]);

  useEffect(() => {
    selectedPermission && onSelect(selectedPermission);
  }, [selectedPermission])

  const loadOldPermission = async () => {
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

  const loadPermissionByShowTitle = async () => {
    await fetch(`api/v1/permissions?showTitle=${search}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setPermissions(data));
  }

  const loadPermissionItems = async (permissionId: string) => {
    await fetch(`api/v1/permissions/${permissionId}?item=true`)
      .then(res => res.status === 200 && res.json())
      .then(data => setPermissionItems(data));
  }

  const handleSearchPermission = () => {
    loadPermissionByShowTitle();
  }

  const handleResetPermission = () => {
    setRoots([[...roots][0]]);
    setSearch("");
  }

  const handleBackward = () => {
    setSelectedPermission(undefined);

    const tempRoots: PermissionType[] = [...roots];
    tempRoots.pop();
    setRoots(tempRoots);
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
            loadOldPermission();
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

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 356, bgcolor: 'background.paper' }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: PermissionType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.showTitle}</Button>
          ))}
        </Breadcrumbs>
        <Box sx={{ display: "flex" }}>
          <ModifyButtons save onAction={handleSaveAction} />
        </Box>

        <List component="nav" sx={{ py: 0 }}>
          <ListItem component="div" disablePadding sx={{ px: 1, pb: 1 }}>
            <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
              value={search} onChange={event => setSearch(event.target.value)} sx={{ m: 0 }} />
            <IconButton onClick={handleSearchPermission} disabled={search.length === 0} title="جستجو">
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleResetPermission} title="ریست">
              <CachedIcon />
            </IconButton>
            <IconButton onClick={handleBackward} disabled={roots.length === 1} title="بازگشت">
              <ReplyIcon />
            </IconButton>
          </ListItem>
          {permissions.map((permission: PermissionType) => (
            <>
              <ListItem key={permission._id} sx={{ py: 0, minHeight: 24 }}>
                <IconButton sx={{ px: 0 }} onClick={() => handleSubPermission(permission)} disabled={permission.kind === 3}>
                  {permission.kind === 1 && <RuleFolderIcon />}
                  {permission.kind === 2 && openPermissionItems === permission._id && <ExpandLess />}
                  {permission.kind === 2 && openPermissionItems !== permission._id && <ExpandMore />}
                </IconButton>
                {permission.kind !== 1 && <Checkbox checked={newPermissions.includes(permission._id)} onChange={() => handleToggle(permission._id)} />}
                <ListItemButton sx={{ py: 0, px: 1 }} selected={selectedPermission?._id === permission._id} onClick={() => setSelectedPermission(permission)}>
                  <ListItemText primary={permission.showTitle} />
                </ListItemButton>
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
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              }
            </>
          ))}
        </List>
      </Box >
      <Snack {...snackProps} />
    </>
  )
}