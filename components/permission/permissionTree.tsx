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

import type { PermissionType } from "@/types/permissionType";
import ModifyButtons from "../general/modifyButtons/modifyButtons";

export default function PermissionTree({ onSave }: { onSave: (PermissionIds: string[]) => void }): React.JSX.Element {

  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [permissionItems, setPermissionItems] = useState<PermissionType[]>([]);
  const [roots, setRoots] = useState<PermissionType[]>([{ _id: "null", title: "", showTitle: "خانه", root: "null", kind: 1 }])
  const [search, setSearch] = useState<string>("");
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<PermissionType>();
  const [openPermissionItems, setopenPermissionItems] = useState<string>("");

  useEffect(() => {
    loadPermissionByRoot();
  }, []);

  useEffect(() => {
    loadPermissionByRoot();
  }, [roots]);

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
    const index = checkedPermissions.indexOf(permissionId);
    const tempChecked = [...checkedPermissions]
    index === -1 ? tempChecked.push(permissionId) : tempChecked.splice(index, 1);
    setCheckedPermissions(tempChecked);
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
    action === "Save" && onSave(checkedPermissions);
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
                {permission.kind !== 1 && <Checkbox checked={checkedPermissions.includes(permission._id)} onChange={() => handleToggle(permission._id)} />}
                <ListItemButton sx={{ py: 0, px: 1 }} selected={selectedPermission?._id === permission._id} onClick={() => setSelectedPermission(permission)}>
                  <ListItemText primary={permission.showTitle} />
                </ListItemButton>
              </ListItem>
              {permission.kind === 2 &&
                <Collapse in={openPermissionItems === permission._id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {permissionItems.map((permissionItem: PermissionType) => (
                      <ListItem key={permissionItem._id} sx={{ py: 0, pl: 7, maxHeight: 28 }}>
                        <Checkbox checked={checkedPermissions.includes(permissionItem._id)} onChange={() => handleToggle(permissionItem._id)} />
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
    </>
  )
}