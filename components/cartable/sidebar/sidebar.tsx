"use client"

import { useState, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  TextField, InputAdornment, Typography, Box, Divider, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Paper, IconButton, Tooltip, Badge
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CollectionsIcon from "@mui/icons-material/Collections";
import CachedIcon from "@mui/icons-material/Cached";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import type { InboxListType } from "@/types/cartableType";

const Collections = styled(List)<{ component?: React.ElementType }>({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
});

const SideBar = memo(({ collections, place }: { collections: InboxListType[], place: "inbox" | "outbox" }): React.JSX.Element => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<string>(searchParams.get("collectionId") ?? "");
  const [collectionsList, setCollectionsList] = useState<InboxListType[]>([]);

  const loadCollectionsList = () => {
    setCollectionsList([...collections].filter((collection: InboxListType) => !search ? collection : collection.title.includes(search ?? "")))
  }

  useMemo(() => {
    loadCollectionsList();
  }, [collections, search]);

  const updateCartable = () => {
    router.refresh();
  }

  const handleOpenCollection = (collectionId: string) => {
    setSelectedCollection(collectionId);
    router.replace(`/${place}?collectionId=${collectionId}`);
  }

  return (
    <Box sx={{ display: "flex", boxShadow: 1 }}>
      <Paper elevation={0} sx={{ maxWidth: 256 }}>
        <Collections component="nav" disablePadding>
          <ListItemButton component="a" href="#customized-list" sx={{ display: { xs: "none", md: "block" } }}>
            <ListItemIcon sx={{ fontSize: 20 }}><CollectionsIcon /></ListItemIcon>
            <ListItemText sx={{ my: 0 }} primary={place === "inbox" ? "کارتابل جاری" : "کارتابل پیگیری"} primaryTypographyProps={{ fontSize: 20, fontWeight: "medium", letterSpacing: 0, }} />
          </ListItemButton>
          <Divider />
          <ListItem component="div" disablePadding>
            <ListItemButton sx={{ height: 56 }}>
              <TextField size="small" label={<Typography variant="body2">جستجو</Typography>} variant="outlined"
                value={search} onChange={event => setSearch(event.target.value)}
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
          <Box sx={{ pb: open ? 2 : 0, }} >
            <ListItemButton alignItems="flex-start" onClick={() => setOpen(!open)}
              sx={{ px: 3, pt: 2.5, pb: open ? 0 : 2.5, "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } }, }}>
              <ListItemText primary="مدارک" primaryTypographyProps={{ fontSize: 15, fontWeight: "medium", lineHeight: "20px", mb: "2px", }}
                secondary="لیست مدارک"
                secondaryTypographyProps={{ noWrap: true, fontSize: 12, lineHeight: "16px", color: open ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.5)", }}
                sx={{ my: 0 }}
              />
              <KeyboardArrowDown sx={{ mr: -1, opacity: 0, transform: open ? "rotate(-180deg)" : "rotate(0)", transition: "0.2s", }} />
            </ListItemButton>
            {open &&
              collectionsList.sort((a, b) => a._id > b._id ? 1 : -1).map((collection) => (
                <ListItemButton key={collection._id} sx={{ py: 0, minHeight: 32, mt: 1 }} onClick={() => handleOpenCollection(collection._id)}>
                  <Badge badgeContent={collection.count} color="secondary">
                    <ListItemText primary={collection.title} primaryTypographyProps={{
                      fontSize: selectedCollection === collection._id ? 16 : 14,
                      fontWeight: selectedCollection === collection._id ? 700 : 400,
                      color: selectedCollection === collection._id ? "primary" : "inherit",
                    }} />
                  </Badge>
                </ListItemButton>
              ))}
          </Box>
        </Collections>
      </Paper>
    </Box>
  );
},
  (prevProps, nextProps) => prevProps.place === nextProps.place
)

export default SideBar;
