"use client"

import { useState } from "react";
import { Menu, TextField, IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

export default function TextSave({ anchor, label, onAction }: { anchor: null | HTMLElement, label?: string, onAction: (value: string) => void }): React.JSX.Element {

  const [value, setValue] = useState<string>("");
  const open = Boolean(anchor);

  const handleClose = () => {
    onAction("");
  }
  const handleAction = () => {
    if (value) {
      onAction(value);
      setValue("");
    }
  }

  return (
    <>
      <Menu anchorEl={anchor} open={open} onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <TextField value={value} onChange={event => setValue(event.target.value)} size="small" label={label} />
        <IconButton onClick={handleAction}>
          <SaveIcon />
        </IconButton>
      </Menu>
    </>
  )
}