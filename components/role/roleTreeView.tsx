"use client"

import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { RoleType } from '@/types/RoleType';
import Modal from '../general/modal/modal';
import RoleModify from './roleModify';
import Delete from '../general/delete/delete';
import Snack from '../general/snack/snack';
import type { SnackProps } from '@/types/General';

export default function RoleTreeView({ isUpdate, onSelectRole }: { isUpdate: boolean, onSelectRole: (role: RoleType) => void }): React.JSX.Element {

  const [snackProps, setSnackProps] = useState<SnackProps>({ context: "", isOpen: false, severity: "success", onCloseSnack: () => { } });
  const [isOpenNewModal, setIsOpenNewModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const [treeData, setTreeData] = useState<RoleType[]>([]);

  useEffect(() => {
    loadRoleData();
  }, [])

  useEffect(() => {
    isUpdate && loadRoleData();
  }, [isUpdate])

  const loadRoleData = async () => {
    await fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => setTreeData(data));
  }

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    onSelectRole(role);
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
        <IconButton onClick={handleOpenNewModal} title="جدید">
          <AddIcon />
        </IconButton>
        <IconButton color="error" onClick={handleOpenDeleteModal} title="حذف" disabled={selectedRole ? false : true}>
          <DeleteIcon />
        </IconButton>
        <SimpleTreeView aria-label="icon expansion" expansionTrigger="iconContainer" slots={{ expandIcon: ChevronLeftIcon }}>
          {
            treeData.map(role => (
              <TreeItem itemId={role.title} key={role._id} label={role.title} onClick={() => handleSelectRole(role)} />
            ))
          }
        </SimpleTreeView>
        <Snack {...snackProps} />
        <Modal title="سمت جدید" isOpen={isOpenNewModal} onCloseModal={handleCloseModal} body={<RoleModify root={selectedRole?._id ?? "-1"} onModify={handleModify} />} />
        <Modal title="حذف سمت" isOpen={isOpenDeleteModal} onCloseModal={handleCloseModal} body={<Delete message={`آیا از حذف سمت ${selectedRole?.title} مطمئن هستید؟`} onDelete={handleDelete} />} />
      </Box>
    </>
  )
}