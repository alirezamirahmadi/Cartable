import { cookies } from "next/headers";
import { Box } from "@mui/material";

import SideBar from "@/components/cartable/sidebar/sidebar"
import TopBar from "@/components/cartable/inbox/topbar";
import DocumentList from "@/components/cartable/documentList/documentList";
import { verifyToken } from "@/utils/token";
import { outboxCollections, outboxDocument } from "@/actions/cartable";
import type { CollectionListType } from "@/types/cartableType";

export default async function Outbox({ searchParams }: { searchParams?: { [key: string]: string } }) {

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");
  const { collectionId } = searchParams ?? { collectionId: "" };

  const documents = await outboxDocument(collectionId, tokenPayload);
  const collections: CollectionListType[] = await outboxCollections(tokenPayload);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 300 }}>
          <SideBar collections={collections} place="outbox" />
        </Box>
        <Box sx={{ width: "100%", mx: 1 }}>
          <TopBar collections={collections} place="outbox" />
          <DocumentList documents={documents} place="outbox" />
        </Box>
      </Box>
    </>
  )
}