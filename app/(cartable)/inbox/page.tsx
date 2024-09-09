import { cookies } from "next/headers";
import { Box } from "@mui/material";

import { verifyToken } from "@/utils/token";
import TopBar from "@/components/cartable/inbox/topbar";
import SideBar from "@/components/cartable/sidebar/sidebar";
import DocumentList from "@/components/cartable/documentList/documentList";
import { inboxCollections, inboxDocuments } from "@/actions/cartable";
import type { CollectionListType } from "@/types/cartableType";

export default async function Inbox({ searchParams }: { searchParams?: { [key: string]: string } }) {

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");
  const { collectionId } = searchParams ?? { collectionId: "" };

  const documents = await inboxDocuments(collectionId, tokenPayload);
  const collections: CollectionListType[] = await inboxCollections(tokenPayload);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 300 }}>
          <SideBar collections={collections} />
        </Box>
        <Box sx={{ width: "100%", mx: 1 }}>
          <TopBar collections={collections} />
          <DocumentList documents={documents} />
        </Box>
      </Box>
    </>
  )
}

