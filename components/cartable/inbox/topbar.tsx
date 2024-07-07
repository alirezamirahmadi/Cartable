"use client"

import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Menu, Container, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import SideBar from '../sidebar';

export default function TopBar(): React.JSX.Element {

  const [showType, setShowType] = useState<string>("1");
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  }

  const handleChangeShowType = (event: SelectChangeEvent) => {
    setShowType(event.target.value);
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit" >
              <CollectionsIcon />
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left', }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }, }}
            >
              <SideBar />
            </Menu>
          </Box>
          <FormControl>
            <InputLabel>نمایش</InputLabel>
            <Select value={showType} label="نمایش" onChange={handleChangeShowType}>
              <MenuItem value={1}>کلیه مدارک کارتابل</MenuItem>
              <MenuItem value={2}>مدارک خوانده شده</MenuItem>
              <MenuItem value={3}>مدارک خوانده نشده</MenuItem>
              <MenuItem value={4}>مدارک ارجاع شده</MenuItem>
              <MenuItem value={5}>مدارک ارجاع نشده</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
