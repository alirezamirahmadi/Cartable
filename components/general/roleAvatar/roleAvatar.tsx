
import { ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";

export default function RoleAvatar({ primary, secondary, src }:
  { primary: string, secondary: string, src: string }): React.JSX.Element {
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt={primary} src={src} />
        </ListItemAvatar>
        <ListItemText primary={primary} secondary={secondary} />
      </ListItem>
    </>
  )
}