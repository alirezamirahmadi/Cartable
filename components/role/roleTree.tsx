"use client"

import { useState, useEffect, ChangeEvent } from 'react';
import {
  Box, IconButton, ListItem, ListItemText, ListItemButton, Breadcrumbs, Button, List, TextField, Checkbox,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import CachedIcon from '@mui/icons-material/Cached';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import GroupIcon from '@mui/icons-material/Group';

import Modal from '../general/modal/modal';
import RoleModify from './roleModify';
import Snack from '../general/snack/snack';
import ModifyButtons from '../general/modifyButtons/modifyButtons';
import type { RoleType } from '@/types/RoleType';
import type { SnackProps } from '@/types/generalType';
import { GroupType } from '@/types/groupType';
import Groups from '../group/groups';

export default function RoleTree({ isUpdate, isTransfer, onSelectRole, onTransfer }:
  { isUpdate?: boolean, isTransfer?: boolean, onSelectRole?: (role: RoleType | undefined) => void, onTransfer?: (root: string) => void }): React.JSX.Element {

  const [roots, setRoots] = useState<RoleType[]>([{ _id: "-1", title: "خانه", root: null, refPerson: "", isDefault: false, isActive: true }]);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [isOpenNewModal, setIsOpenNewModal] = useState(false);
  const [isOpenTransferModal, setIsOpenTransferModal] = useState<boolean>(false);
  const [isOpenMemberGroupsModal, setIsOpenMemberGroupsModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const [treeData, setTreeData] = useState<RoleType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [checked, setChecked] = useState<string[]>([]);
  const [memberGroups, setMemberGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    loadRoleByRoot();
  }, [])

  useEffect(() => {
    isUpdate && loadRoleByRoot();
  }, [isUpdate])

  useEffect(() => {
    loadRoleByRoot();
  }, [roots])

  useEffect(() => {
    onSelectRole && onSelectRole(selectedRole);
  }, [selectedRole])

  const loadRoleByRoot = async () => {
    await fetch(`api/v1/roles?root=${roots[roots.length - 1]._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setTreeData(data));
  }

  const loadRoleByTitle = async () => {
    await fetch(`api/v1/roles?title=${search}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setTreeData(data));
  }

  const loadMemberGroups = async () => {
    selectedRole && await fetch(`api/v1/groupMembers?refRole=${selectedRole?._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setMemberGroups(data))
  }

  const handleBreadcrumbs = (root: RoleType) => {
    setSelectedRole(undefined);

    const tempRoots: RoleType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);

    setRoots(tempRoots);
  }

  const handleBackward = () => {
    setSelectedRole(undefined);

    const tempRoots: RoleType[] = [...roots];
    tempRoots.pop();
    setRoots(tempRoots);
  }

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
  }

  const handleSubRole = (role: RoleType) => {
    setSelectedRole(undefined);

    setRoots([...roots, role]);
  }

  const handleTransfer = () => {
    isTransfer && onTransfer ? onTransfer(checked.length === 1 ? checked[0] : "") : setIsOpenTransferModal(true);
  }

  const handleTransferTo = async (root: string) => {
    setIsOpenTransferModal(false);

    if (checked.includes(root)) {
      setSnackProps({ context: "سمت مقصد نمی تواند از سمت های انتخاب شده جهت انتقال باشد", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }

    await fetch("api/v1/roles", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ roleIds: checked, root })
    })
      .then(res => {
        if (res.status === 201) {
          search ? loadRoleByTitle() : loadRoleByRoot();
          setChecked([]);
        }
      })
  }

  const handleToggle = (roleId: string) => {
    const index = checked.indexOf(roleId);

    if (!isTransfer) {
      const tempChecked = [...checked];
      index === -1 ? tempChecked.push(roleId) : tempChecked.splice(index, 1);
      setChecked([...tempChecked]);
    }
    else {
      setChecked(index === -1 ? [roleId] : []);
    }
  }

  const handleMemberGroups = () => {
    loadMemberGroups().then(() => setIsOpenMemberGroupsModal(true));
  }

  const handleMemberGroupsAction = (group: GroupType, action: string) => {
    switch (action) {
      case "SelectGroup":
        addMemberGroup(group._id);
        break;
      case "Delete":
        deleteMemberGroup(group._id);
        break;
    }
  }

  const addMemberGroup = async (refGroup: string) => {
    selectedRole && await fetch(`api/v1/groupMembers`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ refGroup, refRole: selectedRole._id })
    })
      .then(res => { res.status === 201 && loadMemberGroups() });
  }

  const deleteMemberGroup = async (refGroup: string) => {
    selectedRole && await fetch(`api/v1/groupMembers?refGroup=${refGroup}&refRole=${selectedRole._id}`, {
      method: "DELETE"
    })
      .then(res => { res.status === 200 && loadMemberGroups() });
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);
  }

  const handleSearchRole = () => {
    loadRoleByTitle();
  }

  const handleResetRole = () => {
    setRoots([[...roots][0]]);
    setSearch("");
  }

  const handleModifyRoleAction = (data: any, action: string) => {
    switch (action) {
      case "Add":
        setIsOpenNewModal(true);
        break;
      case "Delete":
        deleteRole();
    }
  }

  const handleModify = (isModify: boolean) => {
    if (isModify) {
      setIsOpenNewModal(false);
      loadRoleByRoot();
      setSnackProps({ context: "سمت مورد نظر با موفقیت ایجاد گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  const deleteRole = async () => {
    await fetch(`api/v1/roles/${selectedRole?._id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status === 200) {
          loadRoleByRoot();
          setSelectedRole(undefined);
          setSnackProps({ context: "سمت مورد نظر با موفقیت حذف گردید.", isOpen: true, severity: "info", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
        }
      })
      .catch(() => {
        setSnackProps({ context: "عملیات حذف با خطا مواجه شده است", isOpen: true, severity: "error", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
      })
  }

  return (
    <>
      <Box sx={{ minHeight: 352, minWidth: 250, mx: 2, mb: 2, py: 2, border: 1, borderRadius: 2 }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: RoleType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.title}</Button>
          ))}
        </Breadcrumbs>

        <Box sx={{ display: "flex" }}>
          <IconButton onClick={handleTransfer} disabled={checked.length === 0} title={isTransfer ? "انتقال به" : "انتقال"}>
            {isTransfer ? <MoveDownIcon /> : <MoveUpIcon />}
          </IconButton>
          <IconButton onClick={handleMemberGroups} disabled={selectedRole ? false : true} title="گروه های عضو">
            <GroupIcon />
          </IconButton>
          <ModifyButtons add omit={selectedRole ? true : false} onAction={handleModifyRoleAction} omitMessage={`آیا از حذف سمت ${selectedRole?.title} مطمئن هستید؟`} />
        </Box>
        <List>
          <ListItem component="div" disablePadding sx={{ px: 1, pb: 1 }}>
            <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
              value={search} onChange={handleChangeSearch} sx={{ m: 0 }} />
            <IconButton disabled={search.length === 0} onClick={handleSearchRole} title="جستجو">
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleResetRole} title="ریست">
              <CachedIcon />
            </IconButton>
            <IconButton onClick={handleBackward} disabled={roots.length === 1} title="بازگشت">
              <ReplyIcon />
            </IconButton>
          </ListItem>
          {
            treeData.map(role => (
              <ListItem key={role._id} sx={{ py: 0, minHeight: 24 }}>
                <Checkbox value={checked.includes(role._id ?? "")} onChange={() => handleToggle(role._id ?? "")} />
                <IconButton onClick={() => handleSubRole(role)}>
                  <PersonIcon />
                </IconButton>
                <ListItemButton sx={{ py: 0 }} selected={selectedRole?._id === role._id} onClick={(event) => handleSelectRole(role)}>
                  <ListItemText primary={role.title} />
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>
        <Snack {...snackProps} />
        <Modal title="سمت جدید" isOpen={isOpenNewModal} onCloseModal={() => setIsOpenNewModal(false)} body={<RoleModify root={roots[roots.length - 1]._id ?? null} onModify={handleModify} />} />
        <Modal title="انتقال به" isOpen={isOpenTransferModal} onCloseModal={() => setIsOpenTransferModal(false)} body={<RoleTree isTransfer={true} onTransfer={handleTransferTo} />} />
        <Modal title="گروه های عضو" isOpen={isOpenMemberGroupsModal} onCloseModal={() => setIsOpenMemberGroupsModal(false)} body={<Groups groups={memberGroups} selectGroup omit onAction={handleMemberGroupsAction} />} />
      </Box>
    </>
  )
}