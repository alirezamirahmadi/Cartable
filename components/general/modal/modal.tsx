"use client"

import { useState, useEffect, memo, Suspense } from 'react';
import { Box, Typography, Modal as MUIModal, IconButton, Divider } from '@mui/material';
import { Close } from '@mui/icons-material';

import Loading from '../loading/loading';

const Modal = memo(({ title, isOpen, body, fullWidth, onCloseModal }:
  { title: string, isOpen: boolean, body: React.ReactNode, fullWidth?: boolean, onCloseModal: () => void }): React.JSX.Element => {

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    width: fullWidth ? "95%" : "inherit",
    maxHeight: "98%",
    pb: 2,
    px: 4,
    overflow: "auto",
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onCloseModal();
  }

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen])

  return (
      <MUIModal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div className="flex justify-between items-center">
            <Typography variant="h6" component="h2">{title}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
          <Divider sx={{ my: 2 }} />
          <Suspense fallback={<Loading />}>
            {body}
          </Suspense>
        </Box>
      </MUIModal>
  );
},
  (prevProps, nextProps) => prevProps.title === nextProps.title && prevProps.isOpen === nextProps.isOpen
)

export default Modal;