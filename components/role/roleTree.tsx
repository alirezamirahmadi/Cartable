"use client"

import { useState, useEffect, ChangeEvent } from 'react';
import {
  Box, IconButton, ListItem, ListItemText, ListItemButton, Breadcrumbs, Button, List, TextField, InputAdornment,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';

import { RoleType } from '@/types/roleType';
import Modal from '../general/modal/modal';
import RoleModify from './roleModify';
import Delete from '../general/delete/delete';
import Snack from '../general/snack/snack';
import type { SnackProps } from '@/types/generalType';

export default function RoleTree({ isUpdate, onSelectRole }: { isUpdate: boolean, onSelectRole: (role: RoleType) => void }): React.JSX.Element {

  const [roots, setRoots] = useState<RoleType[]>([{ _id: "-1", title: "خانه", root: null, refPerson: "", isActive: true }]);
  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [isOpenNewModal, setIsOpenNewModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const [treeData, setTreeData] = useState<RoleType[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    loadRoleData();
  }, [])

  useEffect(() => {
    isUpdate && loadRoleData();
  }, [isUpdate])

  useEffect(() => {
    loadRoleData();
  }, [roots])

  const loadRoleData = async () => {
    await fetch(`api/v1/roles?root=${roots[roots.length - 1]._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setTreeData(data));
  }

  const handleBreadcrumbs = (root: RoleType) => {
    const tempRoots: RoleType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);
    
    setRoots(tempRoots);
  }
  
  const handleBackward = () => {
    const tempRoots: RoleType[] = [...roots];
    tempRoots.pop();
    setRoots(tempRoots);
  }

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    onSelectRole(role);
  }

  const handleSubRole = (role: RoleType) => {
    setRoots([...roots, role]);
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    // setFilteredGroups(searchText ? groups.filter((group: GroupType) => group.title.includes(searchText)) : groups);
  }

  const handleOpenNewModal = () => {
    setIsOpenNewModal(true);
  }

  const handleOpenDeleteModal = () => {
    setIsOpenDeleteModal(true);
  }

  const handleCloseModal = () => {
    setIsOpenNewModal(false);
    setIsOpenDeleteModal(false);
  }

  const handleModify = (isModify: boolean) => {
    if (isModify) {
      setIsOpenNewModal(false);
      loadRoleData();
      setSnackProps({ context: "سمت مورد نظر با موفقیت ایجاد گردید.", isOpen: true, severity: "success", onCloseSnack: () => { setSnackProps({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } }) } })
    }
  }

  const handleDelete = async (isDelete: boolean) => {
    setIsOpenDeleteModal(false);

    isDelete && await fetch(`api/v1/roles/${selectedRole?._id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status === 200) {
          loadRoleData();
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

        <IconButton onClick={handleOpenNewModal} title="جدید">
          <AddIcon />
        </IconButton>
        <IconButton color="error" onClick={handleOpenDeleteModal} title="حذف" disabled={selectedRole ? false : true}>
          <DeleteIcon />
        </IconButton>
        <List>
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
          {
            treeData.map(role => (
              <ListItem key={role._id} sx={{ py: 0, minHeight: 24 }}>
                <IconButton onClick={() => handleSubRole(role)}>
                  <GroupIcon />
                </IconButton>
                <ListItemButton sx={{ py: 0 }} selected={selectedRole?._id === role._id} onClick={(event) => handleSelectRole(role)}>
                  <ListItemText primary={role.title} />
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>
        <Snack {...snackProps} />
        <Modal title="سمت جدید" isOpen={isOpenNewModal} onCloseModal={handleCloseModal} body={<RoleModify root={selectedRole?._id ?? null} onModify={handleModify} />} />
        <Modal title="حذف سمت" isOpen={isOpenDeleteModal} onCloseModal={handleCloseModal} body={<Delete message={`آیا از حذف سمت ${selectedRole?.title} مطمئن هستید؟`} onDelete={handleDelete} />} />
      </Box>
    </>
  )
}