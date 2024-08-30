"use client";

import { useRouter } from "next/navigation";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography, ListItemIcon } from "@mui/material";
import CollectionsIcon from '@mui/icons-material/Collections';

import type { CollectionListType } from "@/types/cartableType";

export default function NewCollectionsList({ collections }: { collections: CollectionListType[] }): React.JSX.Element {

  const router = useRouter();

  const handleOpenCollection = async (collectionId: string) => {
    router.replace(`/inbox?collectionId=${collectionId}&filter=nonObserved`);
  }

  return (
    <Box sx={{ maxWidth: 356, p: 1 }}>
      <Box sx={{ display: "flex", columnGap: 2 }}>
        <CollectionsIcon />
        <Typography variant="h6">لیست مدارک خوانده نشده</Typography>
      </Box>
      <Divider variant="middle" />
      <List>
        {collections.sort((a, b) => a._id > b._id ? 1 : -1).map((collection: CollectionListType) => (
          <ListItem key={collection._id}>
            <ListItemButton sx={{ py: 0, minHeight: 32, mt: 1 }} onClick={() => handleOpenCollection(collection._id)}>
              <ListItemText>
                <Typography variant="body1">
                  {collection.title}
                </Typography>
              </ListItemText>
              <ListItemText>
                <Typography variant="body1" color="primary" sx={{textAlign:"end"}}>
                  {collection.count}
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box >
  );
}
