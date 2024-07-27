"use client"

import { useState, useEffect, ChangeEvent } from "react";
import { Box, List, ListItemButton, TextField, ListItemText, ListItem, IconButton, Typography, Menu, InputAdornment, Breadcrumbs, Button } from "@mui/material"
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import type { GroupType } from "@/types/groupType";
import type { RoleType } from "@/types/roleType";
import Roles from "@/components/role/roles";
import Modal from "@/components/general/modal/modal";
import TextSave from "@/components/general/textSave/textSave";
import Snack from "@/components/general/snack/snack";
import { SnackProps } from "@/types/generalType";
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import Delete from "@/components/general/delete/delete";

export default function Groups(): React.JSX.Element {

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupType>();
  const [roots, setRoots] = useState<GroupType[]>([{ _id: "-1", title: "خانه", root: "-1", kind: 1 }]);
  const [search, setSearch] = useState<string>("");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupType[]>([]);
  const [isOpenRolesModal, setIsOpenRolesModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [anchorGroup, setAnchorGroup] = useState<null | HTMLElement>(null);
  const [anchorFolder, setAnchorFolder] = useState<null | HTMLElement>(null);
  const [anchorEdit, setAnchorEdit] = useState<null | HTMLElement>(null);
  const [snackProps, setSnackProps] = useState<SnackProps>();

  useEffect(() => {
    loadGroupData();
    loadRoleData();
  }, [])

  useEffect(() => {
    loadGroupData();
  }, [roots])

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, group: GroupType) => {
    setSelectedGroup(group);
  }

  const loadGroupData = async () => {
    await fetch(`api/v1/groups/${roots[roots.length - 1]._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setGroups(data);
        setFilteredGroups(data);
      })
  }

  const loadRoleData = async () => {
    await fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => setRoles(data))
  }

  const handleSubGroup = (group: GroupType) => {
    switch (group.kind) {
      case 1:
        setSelectedGroup(undefined);
        setRoots([...roots, group]);
        break;
      case 2:
        setIsOpenRolesModal(true);
        break;
    }
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredGroups(searchText ? groups.filter((group: GroupType) => group.title.includes(searchText)) : groups);
  }

  const handleBackward = () => {
    setSelectedGroup(undefined);

    const tempRoots: GroupType[] = [...roots];
    tempRoots.pop();
    setRoots(tempRoots);
  }

  const handleBreadcrumbs = (root: GroupType) => {
    setSelectedGroup(undefined);

    const tempRoots: GroupType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);

    setRoots(tempRoots);
  }

  const handleActionRole = (role: RoleType) => {

  }

  const handleNewGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorGroup(event.currentTarget);
  }

  const handleActionNewGroup = async (value: string) => {
    setAnchorGroup(null);

    value && await fetch("api/v1/groups", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ title: value, root: roots[roots.length - 1]._id !== "-1" ? roots[roots.length - 1]._id : null, kind: 2 })
    })
      .then(res => {
        res.status === 201 ? loadGroupData() :
          setSnackProps({ context: "ایجاد گروه جدید با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
      .catch(() => {
        setSnackProps({ context: "ایجاد گروه جدید با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  const handleNewFolder = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorFolder(event.currentTarget);
  }

  const handleActionNewFolder = async (value: string) => {
    setAnchorFolder(null);

    value && await fetch("api/v1/groups", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ title: value, root: roots[roots.length - 1]._id !== "-1" ? roots[roots.length - 1]._id : null, kind: 1 })
    })
      .then(res => {
        res.status === 201 ? loadGroupData() :
          setSnackProps({ context: "ایجاد پوشه جدید با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
      .catch(() => {
        setSnackProps({ context: "ایجاد پوشه جدید با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  const handleModifyAction = (data: any, action: string) => {
    switch (action) {
      case "Edit":
        setAnchorEdit(document.getElementById("ibtnNewGroup"));
        break;
      case "Delete":
        setIsOpenDeleteModal(true);
        break;
    }
  }

  const handleActionEdit = async (value: string) => {
    setAnchorEdit(null);

    value && await fetch(`api/v1/groups/${selectedGroup?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ ...selectedGroup, title: value })
    })
      .then(res => {
        switch (res.status) {
          case 201:
            setSnackProps({ context: "ویرایش نام پوشه/گروه با موفقیت انجام شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
            loadGroupData();
            break;
          default:
            setSnackProps({ context: "ویرایش نام پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
            break;
        }
      })
      .catch(() => {
        setSnackProps({ context: "ویرایش نام پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  const handleDeleteGroup = async (isDelete: boolean) => {
    setIsOpenDeleteModal(false);

    isDelete && selectedGroup &&
      await fetch(`api/v1/groups/${selectedGroup._id}`, {
        method: "DELETE"
      })
        .then(res => {
          switch (res.status) {
            case 200:
              setSnackProps({ context: "حذف پوشه/گروه با موفقیت انجام شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              loadGroupData();
              break;
            case 403:
              setSnackProps({ context: "امکان حذف پوشه/گروه به دلیل داشتن زیر مجموعه وجود ندارد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              break;
            default:
              setSnackProps({ context: "حذف پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              break;
          }
        })
        .catch(() => {
          setSnackProps({ context: "حذف پوشه/گروه با مشکل مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
        })
  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 256, bgcolor: 'background.paper' }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: GroupType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.title}</Button>
          ))}
        </Breadcrumbs>

        <Box sx={{ display: "flex" }}>
          <IconButton id="ibtnNewGroup" onClick={handleNewGroup} title="گروه جدید">
            <GroupAddIcon />
          </IconButton>
          <TextSave anchor={anchorGroup} onAction={handleActionNewGroup} label="گروه جدید" />
          <IconButton onClick={handleNewFolder} title="پوشه جدید">
            <CreateNewFolderIcon />
          </IconButton>
          <TextSave anchor={anchorFolder} onAction={handleActionNewFolder} label="پوشه جدید" />
          {selectedGroup && <ModifyButtons edit omit rowData={undefined} onAction={handleModifyAction} />}
          <TextSave anchor={anchorEdit} onAction={handleActionEdit} defaultValue={selectedGroup?.title} />
        </Box>

        <List component="nav" sx={{ py: 0 }}>
          <ListItem component="div" disablePadding>
            <ListItemButton sx={{ height: 56, m: 0 }}>
              <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
                value={search} onChange={handleChangeSearch} sx={{ m: 0 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItemButton>
            <IconButton onClick={handleBackward} disabled={roots.length === 1} title="بازگشت">
              <ReplyIcon />
            </IconButton>
          </ListItem>
          {filteredGroups.map((group: GroupType) => (
            <ListItem key={group._id} sx={{ py: 0, minHeight: 24 }}>
              <IconButton onClick={() => handleSubGroup(group)}>
                {group.kind === 1 ? <FolderSharedIcon /> : <GroupIcon />}
              </IconButton>
              <ListItemButton sx={{ py: 0 }} selected={selectedGroup?._id === group._id} onClick={(event) => handleListItemClick(event, group)}>
                <ListItemText primary={group.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Snack {...snackProps} />
      <Modal isOpen={isOpenRolesModal} title="اعضا گروه" body={<Roles roles={roles} onAction={handleActionRole} omit />} onCloseModal={() => setIsOpenRolesModal(false)} />
      <Modal isOpen={isOpenDeleteModal} title="حذف گروه" body={<Delete message={`آیا از حذف " ${selectedGroup?.title} اطمینان دارید`} onDelete={handleDeleteGroup} />} onCloseModal={() => setIsOpenDeleteModal(false)} />
    </>
  )
}