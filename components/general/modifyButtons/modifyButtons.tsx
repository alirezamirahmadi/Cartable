"use client"

import { useState, memo } from "react";
import dynamic from "next/dynamic";
import { IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

const Modal = dynamic(() => import("../modal/modal"));
import Delete from "../delete/delete";

const ModifyButtons = memo(({ rowData, onAction, add, save, edit, omit, omitMessage }:
  { rowData?: any, onAction: (data: any, action: string) => void, add?: boolean, save?: boolean, edit?: boolean, omit?: boolean, omitMessage?: string }): React.JSX.Element => {

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

  const handleAdd = () => {
    onAction(rowData, 'Add');
  }

  const handleSave = () => {
    onAction(rowData, 'Save');
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
          <IconButton onClick={handleAdd} title="اضافه/جدید">
            <AddIcon />
          </IconButton>
        }
        {save &&
          <IconButton onClick={handleSave} title="ذخیره">
            <SaveIcon />
          </IconButton>
        }
        {edit &&
          <IconButton onClick={handleEdit} title="ویرایش">
            <EditIcon />
          </IconButton>
        }
        {omit &&
          <IconButton color="error" onClick={() => setIsOpenDeleteModal(true)} title="حذف">
            <DeleteIcon />
          </IconButton>
        }
      </Box>
      {isOpenDeleteModal && <Modal title="حذف" isOpen={isOpenDeleteModal} body={<Delete message={omitMessage ?? ""} onDelete={handleDelete} />} onCloseModal={() => setIsOpenDeleteModal(false)} />}
    </>
  )
},
  (prevProps, nextProps) => prevProps.rowData === undefined && nextProps.rowData === undefined &&
    prevProps.add === nextProps.add && prevProps.edit === nextProps.edit && prevProps.omit === nextProps.omit &&
    prevProps.omitMessage === nextProps.omitMessage && prevProps.save === nextProps.save
)

export default ModifyButtons;