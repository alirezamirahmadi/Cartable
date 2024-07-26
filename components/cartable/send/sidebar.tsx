"use client"

import { useState, useEffect, ChangeEvent, ReactNode } from "react";
import { ListItemButton, TextField, InputAdornment, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { RoleType } from "@/types/roleType";

export default function SideBar({ roles, onSelect, Buttons }: { roles: RoleType[], onSelect: (role: RoleType) => void, Buttons?: React.JSX.Element }): React.JSX.Element {

  // const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState<string>("");

  // useEffect(() => {
  //   loadActorData();
  // }, [])

  // const loadActorData = async () => {
  //   await fetch("api/v1/roles")
  //     .then(res => res.status === 200 && res.json())
  //     .then(data => setRoles(data))
  // }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem component="div" disablePadding>
          <ListItemButton sx={{ height: 56 }}>
            <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
              value={search} onChange={handleChangeSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </ListItemButton>
        </ListItem>
        <Divider variant="middle" component="li" />
        {
          roles.map((role: any) => (
            <Box key={role._id}>
              <ListItem alignItems="center">
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  <ListItemAvatar>
                    <Avatar alt={role.person.firstName} src="" sx={{ width: 35, height: 35, mx: "auto" }} />
                  </ListItemAvatar>
                  <ListItemText primary={`${role.person.firstName} ${role.person.lastName}`} secondary={role.title} onClick={() => onSelect(role)} sx={{ cursor: "pointer" }} />
                </ListItem>
                
              </ListItem>
              <Divider variant="middle" component="li" />
            </Box>
          ))
        }
      </List>
    </>
  )
}