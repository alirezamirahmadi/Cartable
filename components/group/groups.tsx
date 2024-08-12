"use client"

import { useState, useEffect, ChangeEvent } from "react";
import {
  ListItemButton, TextField, InputAdornment, List, ListItem, Divider, ListItemText, Typography, Box
} from "@mui/material";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';

import SearchIcon from '@mui/icons-material/Search';
import type { GroupType } from "@/types/groupType";
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";

export default function Groups({ groups, onAction, add, edit, omit }:
  { groups: GroupType[], onAction: (role: GroupType, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean }): React.JSX.Element {

  const [search, setSearch] = useState<string>("");
  const [listGroups, setListGroups] = useState<GroupType[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    setListGroups(groups);
  }, [groups])

  useEffect(() => {
    setFilteredGroups(listGroups);
  }, [listGroups])

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredGroups([...listGroups].filter((role: GroupType) => role.title.includes(searchText)));
  }

  const handleAction = (group: GroupType, action: string) => {
    onAction(group, action);
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', py: 0 }}>
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
          filteredGroups?.map((group: GroupType) => (
            <Box key={group._id}>
              <ListItem alignItems="center">
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  {group.kind === 1 ? <FolderSharedIcon /> : <GroupIcon />}
                  <ListItemText primary={group.title} sx={{ cursor: "pointer" }} />
                </ListItem>
                <ModifyButtons add={add} edit={edit} omit={omit} rowData={group} onAction={handleAction} omitMessage={`آیا از حذف "${group.title}" اطمینان دارید؟`} />
              </ListItem>
              <Divider variant="middle" component="li" />
            </Box>
          ))
        }
      </List>
    </>
  )
}