"use client"

import { useState, useEffect, ChangeEvent } from "react";
import {
  ListItemButton, TextField, InputAdornment, List, ListItem, Divider, ListItemText, ListItemAvatar,
  Avatar, Typography, Box
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import Modal from "../general/modal/modal";
import type { RoleType } from "@/types/RoleType";

export default function Roles({ roles, onAction, add, edit, omit, selectRole }:
  { roles: RoleType[], onAction: (role: RoleType, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean, selectRole?: boolean }): React.JSX.Element {

  const [search, setSearch] = useState<string>("");
  const [listRoles, setListRoles] = useState<RoleType[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleType[]>([]);
  const [isOpenSelectRoleModal, setIsOpenSelectRoleModal] = useState<boolean>(false);
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

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredRoles([...listRoles].filter((role: RoleType) => role.title.includes(searchText) || role.person?.firstName.includes(searchText) || role.person?.lastName.includes(searchText)));
  }

  const handleAction = (role: RoleType, action: string) => {
    onAction(role, action);
  }

  const handleSelectRoleAction = (role: RoleType, action: string) => {
    setIsOpenSelectRoleModal(false);
    onAction(role, "SelectRole");
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', py: 0 }}>
        {selectRole &&
          <Box sx={{ display: "flex" }}>
            <ModifyButtons add onAction={() => setIsOpenSelectRoleModal(true)} />
          </Box>
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
      <Modal isOpen={isOpenSelectRoleModal} title="انتخاب عضو جدید" body={<Roles roles={allRoles} onAction={handleSelectRoleAction} add />} onCloseModal={() => setIsOpenSelectRoleModal(false)} />
    </>
  )
}