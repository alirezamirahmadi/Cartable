"use client"

import { useRouter } from "next/navigation";
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box, Divider } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { changeRole } from "@/lib/features/me/meSlice";

export default function MyRoles(): React.JSX.Element {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const me = useAppSelector(state => state.me);

  const handleChangeRole = (role: any) => {
    dispatch(changeRole({ ...me, selectedRole: role }));
    // router.replace("/");
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {me.roles.map((role) => (
          <Box key={role._id}>
            <ListItem disablePadding >
              <ListItemButton onClick={() => handleChangeRole(role)}>
                <ListItemIcon>
                  {role._id === me.selectedRole._id &&
                    <CheckIcon fontSize="small" />
                  }
                </ListItemIcon>
                <ListItemText id={role._id} primary={role.title} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </>
  )
}