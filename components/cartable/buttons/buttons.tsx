"use client";

import { useState, MouseEvent, ReactNode } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddLinkIcon from '@mui/icons-material/AddLink';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RestorePageIcon from '@mui/icons-material/RestorePage';

import { useAppSelector } from "@/lib/hooks";

const options: { id: number, tilte: string, showTitle: string, permission: string, icon: ReactNode }[] = [
  { id: 1, tilte: "Circulation", showTitle: "گردش مدرک", permission: "/cartable.circulation", icon: <RestorePageIcon fontSize="small" /> },
  { id: 2, tilte: "Attachment", showTitle: "پیوست", permission: "/attachment", icon: <AttachFileIcon fontSize="small" /> },
];

export default function Buttons({ rowData, onAction }: { value: string, onChange: (event: any) => void, rowData: any, onAction: (data: any, action: string) => void }): React.JSX.Element {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const me = useAppSelector(state => state.me);

  const handleOpenMore = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseMore = (item: string) => {
    setAnchorEl(null);
    onAction(rowData, item);
  }

  const handleOpenDocument = () => {
    onAction(rowData, "Open");
  }

  const handleSendDocument = () => {
    onAction(rowData, "Send");
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton color="secondary" onClick={handleOpenDocument} title="مشاهده">
          <VisibilityIcon />
        </IconButton>
        <IconButton color="primary" onClick={handleSendDocument} title="ارجاع">
          <AddLinkIcon />
        </IconButton>
        <IconButton color="secondary" onClick={handleOpenMore}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={() => handleCloseMore("")}>
          {options.map((option) => {
            return me.permissions.includes(option.permission) &&
              (<MenuItem key={option.id} onClick={() => handleCloseMore(option.tilte)}>
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
                {option.showTitle}
              </MenuItem >)
          }
          )}
        </Menu>
      </Box >
    </>
  )
}