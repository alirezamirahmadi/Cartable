"use client"

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Box, Autocomplete, TextField, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

import type { RoleGroupType } from "@/types/generalType";

const SelectRoleGroup = memo(({ rolesAndGroups }: { rolesAndGroups: RoleGroupType[] }): React.JSX.Element => {

  const router = useRouter();

  return (
    <>
      <Autocomplete sx={{ width: 400 }} options={rolesAndGroups} autoHighlight getOptionLabel={(option) => option.title}
        groupBy={(option => option.kind === 1 ? "سمت ها" : "گروه ها")}
        onChange={(event, value) => router.replace(value ? `/permissions?${value?.kind === 1 ? "roleId" : "groupId"}=${value?._id}` : "/permissions")}
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