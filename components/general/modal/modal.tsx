"use client"

import { useState, useEffect } from 'react';
import { Box, Typography, Modal as MUIModal, IconButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  pb: 2,
  px: 4,
};

export default function Modal({ title, isOpen, body, onCloseModal }: { title: string, isOpen: boolean, body: React.ReactNode, onCloseModal: () => void }): React.JSX.Element {

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onCloseModal();
  }

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen])

  return (
    <div>
      <MUIModal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div className="flex justify-between items-center">
            <Typography id="modal-modal-title" variant="h6" component="h2">{title}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <Divider sx={{ my:2 }} />
          {body}
        </Box>
      </MUIModal>
    </div>
  );
}