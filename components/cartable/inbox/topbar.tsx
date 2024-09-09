"use client"

import React, { useState, memo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Box, AppBar, Toolbar, IconButton, Menu, Container, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";

import SideBar from "../sidebar/sidebar";
import type { CollectionListType } from "@/types/cartableType";

const TopBar = memo(({ collections }: { collections: CollectionListType[] }): React.JSX.Element => {

  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<string>(searchParams.get("filter") ?? "all");
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const sidebarBox = useRef();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  }

  const handleChangeShowType = (event: SelectChangeEvent) => {
    const newFilter = event.target.value;
    const collectionId = searchParams.get("collectionId");

    setFilter(newFilter);
    collectionId && router.replace(`/inbox?collectionId=${collectionId}${newFilter !== "all" ? `&filter=${newFilter}` : ""}`)
  }

  return (
    <AppBar position="static" color="transparent" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box ref={sidebarBox} sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit" >
              <CollectionsIcon />
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left", }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" }, }}
            >
              {sidebarBox.current && <SideBar collections={collections} />}
            </Menu>
          </Box>
          {path === "/inbox" &&
            <FormControl>
              <InputLabel>فیلتر</InputLabel>
              <Select value={filter} label="فیلتر" onChange={handleChangeShowType} disabled={searchParams.get("collectionId") ? false : true}>
                <MenuItem value={"all"}>کلیه مدارک کارتابل</MenuItem>
                <MenuItem value={"observed"}>مدارک خوانده شده</MenuItem>
                <MenuItem value={"nonObserved"}>مدارک خوانده نشده</MenuItem>
              </Select>
            </FormControl>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
})

export default TopBar;
