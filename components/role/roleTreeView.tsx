"use client"

import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { RoleType } from '@/types/RoleType';
import Modal from '../general/modal/modal';
import RoleModify from './roleModify';

export default function RoleTreeView({ isUpdate, onSelectRole }: { isUpdate: boolean, onSelectRole: (role: RoleType) => void }): React.JSX.Element {

  const [isOpenModal, setIsOpenModal] = useState(false);
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

  const handleOpenModal = () => {
    setIsOpenModal(true);
  }

  const handleCloseModal = () => {
    setIsOpenModal(false);
  }

  const handleModify = (isModify: boolean) => {
    if (isModify) {
      setIsOpenModal(false);
      loadRoleData();
    }
  }

  return (
    <>
      <Box sx={{ minHeight: 352, minWidth: 250, mx: 2, mb: 2, py: 2, border: 1, borderRadius: 2 }}>
        <IconButton onClick={handleOpenModal}>
          <AddIcon />
        </IconButton>
        <SimpleTreeView aria-label="icon expansion" expansionTrigger="iconContainer" slots={{ expandIcon: ChevronLeftIcon }}>
          {
            treeData.map(role => (
              <TreeItem itemId={role.title} key={role._id} label={role.title} onClick={() => handleSelectRole(role)} />
            ))
          }
        </SimpleTreeView>
        <Modal title="سمت جدید" isOpen={isOpenModal} onCloseModal={handleCloseModal} body={<RoleModify root={selectedRole?._id ?? "-1"} onModify={handleModify} />} />
      </Box>
    </>
  )
}