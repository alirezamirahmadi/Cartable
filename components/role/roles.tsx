"use client"

import { useState, useEffect, ChangeEvent } from "react";
import { ListItemButton, TextField, InputAdornment, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography, Box, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Add } from "@mui/icons-material";
import { RoleType } from "@/types/RoleType";
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import Modal from "../general/modal/modal";

export default function Roles({ roles, onAction, add, edit, omit, newMember, refGroup }: { roles: RoleType[], onAction: (role: RoleType, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean, newMember?: boolean, refGroup?: string }): React.JSX.Element {

  const [search, setSearch] = useState<string>("");
  const [listRoles, setListRoles] = useState<RoleType[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleType[]>([]);
  const [isOpenNewMemberModal, setIsOpenNewMemberModal] = useState<boolean>(false);
  const [allRoles, setAllRoles] = useState<RoleType[]>([]);

  useEffect(() => {
    setListRoles(roles);
  }, [roles])

  useEffect(() => {
    setFilteredRoles(listRoles);
  }, [listRoles])

  useEffect(() => {
    loadRoleData()
  }, [])

  const loadRoleData = async () => {
    await fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => setAllRoles(data))
  }

  const addNewMember = async (role: RoleType) => {
    refGroup && await fetch("api/v1/groupMembers", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ refGroup, refRole: role._id })
    })
      .then(res => {
        if (res.status === 201) {
          setIsOpenNewMemberModal(false);
          onAction(role, "NewMember");
          setListRoles([...listRoles, role]);
        }
      })
  }

  const deleteMember = async (deleteRole: RoleType) => {
    await fetch(`api/v1/groupMembers?refGroup=${refGroup}&refRole=${deleteRole._id}`, {
      method: "DELETE",
    })
      .then(res => res.status === 200 && setListRoles([...listRoles].filter((role: RoleType) => role._id !== deleteRole._id)))
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredRoles([...listRoles].filter((role: RoleType) => role.title.includes(searchText) || role.person?.firstName.includes(searchText) || role.person?.lastName.includes(searchText)));
  }

  const handleAction = (role: RoleType, action: string) => {
    switch (action) {
      case "Delete":
        deleteMember(role);
        break;
    }
    onAction(role, action);
  }

  const handleNewMemberAction = (role: RoleType, action: string) => {
    switch (action) {
      case "Add":
        addNewMember(role);
        break;
    }
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', py: 0 }}>
        {newMember &&
          <ListItem sx={{ py: 0 }}>
            <IconButton onClick={() => setIsOpenNewMemberModal(true)} title="عضو جدید">
              <Add />
            </IconButton>
          </ListItem>
        }
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
                <ModifyButtons add={add} edit={edit} omit={omit} rowData={role} onAction={handleAction} omitMessage={`آیا از حذف "${role.title}" اطمینان دارید؟`} />
              </ListItem>
              <Divider variant="middle" component="li" />
            </Box>
          ))
        }
      </List>
      <Modal isOpen={isOpenNewMemberModal} title="انتخاب عضو جدید" body={<Roles roles={allRoles} onAction={handleNewMemberAction} add />} onCloseModal={() => setIsOpenNewMemberModal(false)} />
    </>
  )
}