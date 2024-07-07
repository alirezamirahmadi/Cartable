"use client"

import { useState, useEffect, ChangeEvent } from 'react';
import { TextField, InputAdornment, Typography, Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, IconButton, Tooltip } from "@mui/material";
import { styled } from '@mui/material/styles';
import CollectionsIcon from '@mui/icons-material/Collections';
import CachedIcon from '@mui/icons-material/Cached';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { CollectionType } from '@/types/cartableType';

const Collections = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export default function SideBar(): React.JSX.Element {

  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [collections, setCollections] = useState<CollectionType[]>([]);

  useEffect(() => {
    loadCollectionData();
  }, [])

  const loadCollectionData = async (searchText?: string) => {
    await fetch(searchText ? `api/v1/collections?showtitle=${searchText}` : "api/v1/collections")
      .then(res => res.json())
      .then(data => setCollections(data))
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const searchText = event.target.value;
    setSearch(searchText);
    loadCollectionData(searchText);
  }

  const updateCartable = () => {
    loadCollectionData();
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Paper elevation={0} sx={{ maxWidth: 256 }}>
        <Collections component="nav" disablePadding>
          <ListItemButton component="a" href="#customized-list">
            <ListItemIcon sx={{ fontSize: 20 }}><CollectionsIcon /></ListItemIcon>
            <ListItemText sx={{ my: 0 }} primary="مدارک"
              primaryTypographyProps={{ fontSize: 20, fontWeight: 'medium', letterSpacing: 0, }} />
          </ListItemButton>
          <Divider />
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
            <Tooltip title="بروزرسانی کارتابل">
              <IconButton onClick={updateCartable}>
                <CachedIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <Box sx={{ bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null, pb: open ? 2 : 0, }} >
            <ListItemButton alignItems="flex-start" onClick={() => setOpen(!open)}
              sx={{ px: 3, pt: 2.5, pb: open ? 0 : 2.5, '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } }, }}>
              <ListItemText primary="مدارک" primaryTypographyProps={{ fontSize: 15, fontWeight: 'medium', lineHeight: '20px', mb: '2px', }}
                secondary="لیست مدارک"
                secondaryTypographyProps={{ noWrap: true, fontSize: 12, lineHeight: '16px', color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)', }}
                sx={{ my: 0 }}
              />
              <KeyboardArrowDown sx={{ mr: -1, opacity: 0, transform: open ? 'rotate(-180deg)' : 'rotate(0)', transition: '0.2s', }} />
            </ListItemButton>
            {open &&
              collections.map((collection) => (
                <ListItemButton key={collection.showTitle} sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }} >
                  <ListItemText primary={collection.showTitle} primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }} />
                </ListItemButton>
              ))}
          </Box>
        </Collections>
      </Paper>
    </Box>
  );
}
