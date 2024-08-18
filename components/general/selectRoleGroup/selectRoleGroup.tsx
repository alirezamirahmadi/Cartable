"use client"

import { useState, useEffect, memo } from "react";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

import type { RoleType } from "@/types/roleType";
import type { RoleGroupType } from "@/types/generalType";
import type { GroupType } from "@/types/groupType";

const SelectRoleGroup = memo(({ onSelect }: { onSelect: (roleGroup: RoleGroupType | null) => void }): React.JSX.Element => {

  const [rolesAndGroups, setRolesAndGroups] = useState<RoleGroupType[]>([]);

  useEffect(() => {
    loadGroupData()
      .then(tempGroup => loadRoleData(tempGroup));
  }, []);

  const loadRoleData = async (tempGroup: RoleGroupType[]) => {
    await fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        const tempRoles: RoleGroupType[] = [];
        data.map((role: RoleType) => {
          tempRoles.push({ _id: role._id, kind: 1, title: `${role.person?.firstName} ${role.person?.lastName} [ ${role.title} ]` })
        })
        setRolesAndGroups([...tempGroup, ...tempRoles])
      })
  }

  const loadGroupData = async () => {
    const tempGroups: RoleGroupType[] = [];
    await fetch("api/v1/groups?kind=2")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        data.map((group: GroupType) => {
          tempGroups.push({ _id: group._id, kind: 2, title: group.title })
        })
      })
    return tempGroups;
  }

  return (
    <>
      <Autocomplete sx={{ width: 400 }} options={rolesAndGroups} autoHighlight getOptionLabel={(option) => option.title}
        groupBy={(option => option.kind === 1 ? "سمت ها" : "گروه ها")}
        onChange={(event, value) => onSelect(value)}
        renderOption={(props, option) => {
          const { ...optionProps } = props;
          return (
            <Box component="li" {...optionProps}>
              {option.kind === 1 ? <PersonIcon /> : <GroupIcon />}
              <Typography variant="body2" sx={{ marginX: 1 }}>{option.title}</Typography>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="انتخاب گروه یا سمت" inputProps={{ ...params.inputProps, autoComplete: 'new-password', }} />
        )}
      />
    </>
  )
},
  () => {
    return true;
  }
)

export default SelectRoleGroup;