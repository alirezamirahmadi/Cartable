"use client"

import { useState, useEffect, ChangeEvent } from "react";
import { Box, List, ListItemButton, TextField, ListItemText, ListItem, IconButton, Typography, Tooltip, InputAdornment, Breadcrumbs, Button } from "@mui/material"
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';

import type { GroupType } from "@/types/groupType";
import type { RoleType } from "@/types/roleType";
import SideBar from "@/components/cartable/send/sidebar";

export default function Groups(): React.JSX.Element {

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [roots, setRoots] = useState<GroupType[]>([{ _id: "-1", title: "خانه", root: "-1", kind: 1 }]);
  const [search, setSearch] = useState<string>("");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    loadGroupData();
  }, [])

  useEffect(() => {
    loadGroupData();
  }, [roots])

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
  }

  const loadGroupData = async () => {
    await fetch(`api/v1/groups/${roots[roots.length - 1]._id}`)
      .then(res => res.status === 200 && res.json())
      .then(data => {
        setGroups(data);
        setFilteredGroups(data);
      })
  }

  const loadRoleData = async () => {
    await fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => setRoles(data))
  }

  const handleSubGroup = (group: GroupType) => {
    switch (group.kind) {
      case 1:
        setRoots([...roots, group]);
        break;

      default:
        break;
    }
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredGroups(searchText ? groups.filter((group: GroupType) => group.title.includes(searchText)) : groups);
  }

  const handleBackward = () => {
    const tempRoots: GroupType[] = [...roots];
    tempRoots.pop();
    setRoots(tempRoots);
  }

  const handleBreadcrumbs = (root: GroupType) => {
    const tempRoots: GroupType[] = [...roots];
    do {
      tempRoots.pop();
    }
    while (tempRoots[tempRoots.length - 1]._id !== root._id);

    setRoots(tempRoots);
  }

  const handleSelectRole = (role: RoleType) => {

  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 256, bgcolor: 'background.paper' }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: GroupType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.title}</Button>
          ))}
        </Breadcrumbs>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem component="div" disablePadding>
            <ListItemButton sx={{ height: 56, m: 0 }}>
              <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
                value={search} onChange={handleChangeSearch} sx={{ m: 0 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItemButton>
            <IconButton onClick={handleBackward} disabled={roots.length === 1} title="بازگشت">
              <ReplyIcon />
            </IconButton>
          </ListItem>
          {filteredGroups.map((group: GroupType) => (
            <ListItem key={group._id} sx={{ py: 0, minHeight: 24 }}>
              <IconButton onClick={() => handleSubGroup(group)}>
                {group.kind === 1 ? <FolderSharedIcon /> : <GroupIcon />}
              </IconButton>
              <ListItemButton sx={{ py: 0 }} selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                <ListItemText primary={group.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* <SideBar roles={roles} onSelect={handleSelectRole} buttons={
        <IconButton color="error" onClick={handleDelete} title="حذف">
          <DeleteIcon />
        </IconButton>
      } /> */}
    </>
  )
}