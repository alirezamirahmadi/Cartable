"use client"

import { useState, useEffect, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import {
  ListItemButton, TextField, InputAdornment, List, ListItem, Divider, ListItemText, Typography, Box
} from "@mui/material";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';

import Loading from "../general/loading/loading";
const Modal = dynamic(() => import("../general/modal/modal"), {loading:() => <Loading />});
import ModifyButtons from "@/components/general/modifyButtons/modifyButtons";
import type { GroupType } from "@/types/groupType";

export default function Groups({ groups, onAction, add, edit, omit, selectGroup }:
  { groups: GroupType[], onAction: (group: GroupType, action: string) => void, add?: boolean, edit?: boolean, omit?: boolean, selectGroup?: boolean }): React.JSX.Element {

  const [search, setSearch] = useState<string>("");
  const [listGroups, setListGroups] = useState<GroupType[]>(groups);
  const [filteredGroups, setFilteredGroups] = useState<GroupType[]>([]);
  const [isOpenSelectGroupModal, setIsOpenSelectGroupModal] = useState<boolean>(false);
  const [allGroups, setAllGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    (groups.length > 0 || listGroups.length > 0) && setListGroups(groups);
  }, [groups]);

  useEffect(() => {
    setFilteredGroups(listGroups);
  }, [listGroups]);

  const loadGroupData = async () => {
    await fetch(`api/v1/groups?kind=2`)
      .then(res => res.status === 200 && res.json())
      .then(data => setAllGroups(data));
  }

  const handleSelectGroupAction = (group: GroupType, action: string) => {
    setIsOpenSelectGroupModal(false);
    onAction(group, "SelectGroup");
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);

    setFilteredGroups([...listGroups].filter((role: GroupType) => role.title.includes(searchText)));
  }

  const handleAction = (group: GroupType, action: string) => {
    onAction(group, action);
  }

  const handleOpenselectGroup = () => {
    loadGroupData()
      .then(() => setIsOpenSelectGroupModal(true));
  }

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', py: 0 }}>
        {selectGroup &&
          <Box sx={{ display: "flex" }}>
            <ModifyButtons add onAction={handleOpenselectGroup} />
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
          filteredGroups?.map((group: GroupType) => (
            <Box key={group._id}>
              <ListItem alignItems="center">
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  {group.kind === 1 ? <FolderSharedIcon /> : <GroupIcon />}
                  <ListItemText primary={group.title} sx={{ cursor: "pointer", mx: 1 }} />
                </ListItem>
                <ModifyButtons add={add} edit={edit} omit={omit} rowData={group} onAction={handleAction} omitMessage={`آیا از حذف "${group.title}" اطمینان دارید؟`} />
              </ListItem>
              <Divider variant="middle" component="li" />
            </Box>
          ))
        }
      </List>

      {isOpenSelectGroupModal && <Modal isOpen={isOpenSelectGroupModal} title="انتخاب یک گروه" body={<Groups add groups={allGroups} onAction={handleSelectGroupAction} />} onCloseModal={() => setIsOpenSelectGroupModal(false)} />}
    </>
  )
}