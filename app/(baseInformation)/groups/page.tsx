"use client"

import { useState, useEffect, ChangeEvent } from "react";
import { Box, List, ListItemButton, TextField, ListItemText, ListItem, IconButton, Typography, Menu, InputAdornment, Breadcrumbs, Button } from "@mui/material"
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import type { GroupType } from "@/types/groupType";
import type { RoleType } from "@/types/roleType";
import Roles from "@/components/role/roles";
import Modal from "@/components/general/modal/modal";
import TextSave from "@/components/general/textSave/textSave";

export default function Groups(): React.JSX.Element {

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [roots, setRoots] = useState<GroupType[]>([{ _id: "-1", title: "خانه", root: "-1", kind: 1 }]);
  const [search, setSearch] = useState<string>("");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupType[]>([]);
  const [isOpenRolesModal, setIsOpenRolesModal] = useState<boolean>(false);
  const [anchorGroup, setAnchorGroup] = useState<null | HTMLElement>(null);
  const [anchorFolder, setAnchorFolder] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadGroupData();
    loadRoleData();
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
      case 2:
        setIsOpenRolesModal(true);
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

  const handleActionRole = (role: RoleType) => {

  }

  const handleNewGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorGroup(event.currentTarget);
  }
  
  const handleActionNewGroup = (value: string) => {
    setAnchorGroup(null);
    console.log(value);
  }
  
  const handleNewFolder = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorFolder(event.currentTarget);
  }
  
  const handleActionNewFolder = (value: string) => {
    setAnchorFolder(null);
    console.log(value);
  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 256, bgcolor: 'background.paper' }}>
        <Breadcrumbs>
          {roots.length > 1 && roots.map((root: GroupType, index) => (
            <Button key={root._id} variant="text" disabled={index === roots.length - 1} color="inherit" size="small" sx={{ cursor: "pointer", px: 0 }} onClick={() => handleBreadcrumbs(root)}>{root.title}</Button>
          ))}
        </Breadcrumbs>

        <Box>
          <IconButton onClick={handleNewGroup} title="گروه جدید">
            <GroupAddIcon />
          </IconButton>
          <TextSave anchor={anchorGroup} onAction={handleActionNewGroup} label="گروه جدید"/>
          <IconButton onClick={handleNewFolder} title="پوشه جدید">
            <CreateNewFolderIcon />
          </IconButton>
          <TextSave anchor={anchorFolder} onAction={handleActionNewFolder} label="پوشه جدید"/>
        </Box>

        <List component="nav" sx={{ py: 0 }}>
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
      <Modal isOpen={isOpenRolesModal} title="اعضا گروه" body={<Roles roles={roles} onAction={handleActionRole} omit />} onCloseModal={() => setIsOpenRolesModal(false)} />
    </>
  )
}