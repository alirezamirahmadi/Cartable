import Link from "next/link";
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography, ListItemIcon } from "@mui/material";
import CollectionsIcon from '@mui/icons-material/Collections';

import type { CollectionListType } from "@/types/cartableType";

export default async function NewCollectionsList({ collections }: { collections: CollectionListType[] }) {

  return (
    <Box sx={{ maxWidth: 300, p: 1 }}>
      <Box sx={{ display: "flex", columnGap: 2 }}>
        <CollectionsIcon />
        <Typography variant="h6">لیست مدارک خوانده نشده</Typography>
      </Box>
      <Divider variant="middle" />
      <List>
        {collections.sort((a, b) => a._id > b._id ? 1 : -1).map((collection: CollectionListType) => (
          <ListItem key={collection._id}>
            <Link href={`/inbox?collectionId=${collection._id}&filter=nonObserved`}>
              <ListItemButton sx={{ py: 0, minHeight: 32, mt: 1, minWidth:220 }} >
                <ListItemText>
                  <Typography variant="body1">
                    {collection.title}
                  </Typography>
                </ListItemText>
                <ListItemText>
                  <Typography variant="body1" color="primary" sx={{ textAlign: "end" }}>
                    {collection.count}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box >
  );
}
