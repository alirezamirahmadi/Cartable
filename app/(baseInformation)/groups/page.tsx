"use client"

import { useState, useEffect, ChangeEvent } from "react";
import { Box, List, ListItemButton, TextField, ListItemText, ListItem, IconButton, Typography, Checkbox, Breadcrumbs, Button } from "@mui/material"
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CachedIcon from '@mui/icons-material/Cached';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';

import type { GroupType } from "@/types/groupType";
import type { RoleType } from "@/types/RoleType";
import type { SnackProps } from "@/types/generalType";
import Roles from "@/components/role/roles";
import Modal from "@/components/general/modal/modal";
import TextSave from "@/components/general/textSave/textSave";
import Snack from "@/components/general/snack/snack";
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";

export default function Groups({ isTransfer, onTransfer }: { isTransfer?: boolean, onTransfer?: (root: string) => void }): React.JSX.Element {

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupType>();
  const [roots, setRoots] = useState<GroupType[]>([{ _id: "-1", title: "خانه", root: "-1", kind: 1 }]);
  const [search, setSearch] = useState<string>("");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [openRolesModal, setOpenRolesModal] = useState<{ isOpen: boolean, refGroup: string }>({ isOpen: false, refGroup: "" });
  const [anchorGroup, setAnchorGroup] = useState<null | HTMLElement>(null);
  const [anchorFolder, setAnchorFolder] = useState<null | HTMLElement>(null);
  const [anchorEdit, setAnchorEdit] = useState<null | HTMLElement>(null);
  const [snackProps, setSnackProps] = useState<SnackProps>();
  const [checked, setChecked] = useState<string[]>([]);
  const [isOpenTransferModal, setIsOpenTransferModal] = useState<boolean>(false);

  useEffect(() => {
    loadGroupByRoot();
  }, []);

  useEffect(() => {
    loadGroupByRoot();
  }, [roots]);

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, group: GroupType) => {
    setSelectedGroup(group);
  }

  const loadGroupByRoot = async () => {
    await fetch(`api/v1/groups/${roots[roots.length - 1]._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setGroups(data))
  }

  const loadGroupByTitle = async () => {
    await fetch(`api/v1/groups?title=${search}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setGroups(data))
  }

  const loadRoleData = async (refGroup: string) => {
    await fetch(`api/v1/groupMembers?refGroup=${refGroup}`)
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
        loadRoleData(group._id).then(() => setOpenRolesModal({ isOpen: true, refGroup: group._id }))
        break;
    }
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearch(event.target.value);
  }

  const handleSearchGroup = () => {
    loadGroupByTitle();
  }

  const handleResetGroup = () => {
    setRoots([[...roots][0]]);
    setSearch("");
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

  const handleTransferTo = async (root: string) => {
    setIsOpenTransferModal(false);

    if (checked.includes(root)) {
      setSnackProps({ context: "پوشه/گروه مقصد نمی تواند از پوشه/گروه های انتخاب شده جهت انتقال باشد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } });
      return;
    }

    await fetch(`api/v1/groups`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ groupIds: checked, root })
    }).then(res => {
      if (res.status === 201) {
        search ? loadGroupByTitle() : loadGroupByRoot();
        setChecked([]);
      }
    })
  }

  const handleTransfer = () => {
    isTransfer && onTransfer ? onTransfer(checked.length === 1 ? checked[0] : "") : setIsOpenTransferModal(true);
  }

  const handleToggle = (groupId: string) => {
    const index = checked.indexOf(groupId);

    if (!isTransfer) {
      const tempChecked = [...checked];
      index === -1 ? tempChecked.push(groupId) : tempChecked.splice(index, 1);
      setChecked(tempChecked);
    }
    else {
      setChecked(index === -1 ? [groupId] : []);
    }
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
        res.status === 201 ? loadGroupByRoot() :
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
        res.status === 201 ? loadGroupByRoot() :
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
        handleDeleteGroup();
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
            loadGroupByRoot();
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

  const handleDeleteGroup = async () => {
    selectedGroup &&
      await fetch(`api/v1/groups/${selectedGroup._id}`, {
        method: "DELETE"
      })
        .then(res => {
          switch (res.status) {
            case 200:
              setSnackProps({ context: "حذف پوشه/گروه با موفقیت انجام شد", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
              loadGroupByRoot();
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
      <Box sx={{ width: '100%', maxWidth: 356, bgcolor: 'background.paper' }}>
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
          <IconButton onClick={handleTransfer} disabled={checked.length === 0} title={isTransfer ? "انتقال به" : "انتقال"}>
            {isTransfer ? <MoveDownIcon /> : <MoveUpIcon />}
          </IconButton>
          <TextSave anchor={anchorFolder} onAction={handleActionNewFolder} label="پوشه جدید" />
          {selectedGroup && <ModifyButtons edit omit rowData={undefined} onAction={handleModifyAction} omitMessage={`آیا از حذف "${selectedGroup?.title}" اطمینان دارید`} />}
          <TextSave anchor={anchorEdit} onAction={handleActionEdit} defaultValue={selectedGroup?.title} />
        </Box>

        <List component="nav" sx={{ py: 0 }}>
          <ListItem component="div" disablePadding sx={{ px: 1, pb: 1 }}>
            <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
              value={search} onChange={handleChangeSearch} sx={{ m: 0 }} />
            <IconButton onClick={handleSearchGroup} disabled={search.length === 0} title="جستجو">
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleResetGroup} title="ریست">
              <CachedIcon />
            </IconButton>
            <IconButton onClick={handleBackward} disabled={roots.length === 1} title="بازگشت">
              <ReplyIcon />
            </IconButton>
          </ListItem>
          {groups.map((group: GroupType) => (
            <ListItem key={group._id} sx={{ py: 0, minHeight: 24 }}>
              <Checkbox disabled={(isTransfer && group.kind === 2)} checked={checked.includes(group._id)} onChange={() => handleToggle(group._id)} />
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
      <Modal isOpen={openRolesModal.isOpen} title="اعضا گروه" body={<Roles roles={roles} onAction={handleActionRole} omit newMember refGroup={openRolesModal.refGroup} />} onCloseModal={() => setOpenRolesModal({ isOpen: false, refGroup: "" })} />
      <Modal isOpen={isOpenTransferModal} title="انتقال به" body={<Groups isTransfer={true} onTransfer={handleTransferTo} />} onCloseModal={() => setIsOpenTransferModal(false)} />
    </>
  )
}