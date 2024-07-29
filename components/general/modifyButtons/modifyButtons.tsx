"use client"

import { useState } from "react";
import { IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AddIcon from '@mui/icons-material/Add';

import Modal from "../modal/modal";
import Delete from "../delete/delete";

export default function ModifyButtons({ rowData, onAction, add, edit, omit, omitMessage }: { rowData: any, onAction: (data: any, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean, omitMessage?: string }): React.JSX.Element {

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

  const handleAdd = () => {
    onAction(rowData, 'Add');
  }

  const handleEdit = () => {
    onAction(rowData, 'Edit');
  }

  const handleDelete = (isDelete: boolean) => {
    setIsOpenDeleteModal(false);
    isDelete && onAction(rowData, 'Delete');
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {add &&
          <IconButton color="success" onClick={handleAdd} title="اضافه">
            <AddIcon />
          </IconButton>
        }
        {edit &&
          <IconButton color="secondary" onClick={handleEdit} title="ویرایش">
            <AppRegistrationIcon />
          </IconButton>
        }
        {omit &&
          <IconButton color="error" onClick={() => setIsOpenDeleteModal(true)} title="حذف">
            <DeleteIcon />
          </IconButton>
        }
      </Box>
      <Modal title="حذف" isOpen={isOpenDeleteModal} body={<Delete message={omitMessage ?? ""} onDelete={handleDelete} />} onCloseModal={() => setIsOpenDeleteModal(false)}/>
    </>
  )
}