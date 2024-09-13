"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box, Divider } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

import { useAppSelector } from "@/lib/hooks";

export default function MyRoles({ onChangeRole }: { onChangeRole: (isChange: boolean) => void }): React.JSX.Element {

  const [myRoles, setMyRoles] = useState<{ _id: string, title: string, root: string }[]>([]);
  const me = useAppSelector(state => state.me);
  const router = useRouter();

  useEffect(() => {
    loadMyRoles();
  }, []);

  const loadMyRoles = async () => {
    await fetch(`api/v1/roles?refPerson=${me._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => setMyRoles(data))
  }

  const handleChangeRole = async (role: any) => {
    role._id !== me.defaultRole._id &&
      await fetch("api/v1/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({ refPerson: me._id, defaultRoleId: role._id })
      })
        .then(res => {
          if (res.status === 201) {
            router.replace("/");
          }
        })
        .then(() => {
          onChangeRole(true);
        })
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {myRoles.map((role) => (
          <Box key={role._id}>
            <ListItem disablePadding >
              <ListItemButton onClick={() => handleChangeRole(role)}>
                <ListItemIcon>
                  {role._id === me.defaultRole._id &&
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