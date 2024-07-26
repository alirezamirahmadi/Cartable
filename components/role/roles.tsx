"use client"

import { useState, useEffect, ChangeEvent, ReactNode } from "react";
import { ListItemButton, TextField, InputAdornment, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { RoleType } from "@/types/roleType";
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";

export default function Roles({ roles, onAction, add, edit, omit }: { roles: RoleType[], onAction: (role: RoleType, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean }): React.JSX.Element {

  const [search, setSearch] = useState<string>("");
  const [filteredRoles, setFilteredRoles] = useState<RoleType[]>([]);

  useEffect(() => {
    setFilteredRoles(roles);
  }, [roles])

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredRoles([...roles].filter((role: RoleType) => role.title.includes(searchText) || role.person?.firstName.includes(searchText) || role.person?.lastName.includes(searchText)));
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
          filteredRoles?.map((role: any) => (
            <Box key={role._id}>
              <ListItem alignItems="center">
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  <ListItemAvatar>
                    <Avatar alt={role.person.firstName} src="" sx={{ width: 35, height: 35, mx: "auto" }} />
                  </ListItemAvatar>
                  <ListItemText primary={`${role.person.firstName} ${role.person.lastName}`} secondary={role.title} sx={{ cursor: "pointer" }} />
                </ListItem>
                <ModifyButtons add={add} edit={edit} omit={omit} rowData={role} onAction={onAction} />
              </ListItem>
              <Divider variant="middle" component="li" />
            </Box>
          ))
        }
      </List>
    </>
  )
}