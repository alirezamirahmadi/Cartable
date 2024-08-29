import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { Box } from "@mui/material";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

import SideBar from "@/components/cartable/sidebar/sidebar"
import TopBar from "@/components/cartable/inbox/topbar";
import DocumentList from "@/components/cartable/documentList/documentList";
import connectToDB from "@/utils/db";
import sendModel from "@/models/send";
import { verifyToken } from "@/utils/token";
import type { CollectionListType } from "@/types/cartableType";

async function loadCollectionsData (tokenPayload:string | JwtPayload) {
  connectToDB();

  if (!tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const sends = await sendModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .project({ "collection._id": 1, "collection.showTitle": 1 })
      .group({ _id: { "_id": "$collection._id", "showTitle": "$collection.showTitle" } })

    return JSON.parse(JSON.stringify(sends));
  }
  else {
    return [];
  }
}

async function loadCollectionData(collectionId: string, tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!collectionId || !tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const sends = await sendModel.aggregate()
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .match({ "refCollection": new mongoose.Types.ObjectId(collectionId) })
      .project({ "collection.showTitle": 1, "sendDate": 1, "refDocument": 1, "parentReceive": 1 })
      .unwind("$collection")

    return JSON.parse(JSON.stringify(sends));
  }
  return [];
}

async function handleCollectionData (data: any) {
  const myCollections = new Array<CollectionListType>();

  data && data?.map((collection: any) => {
    myCollections.push({ _id: collection?._id?._id ? collection?._id?._id[0] : "", title: collection?._id?.showTitle ? collection?._id?.showTitle[0] : "", count: 0 });
  })
  return myCollections;
}

export default async function Outbox({ searchParams }: { searchParams?: { [key: string]: string } }) {

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");
  const { collectionId } = searchParams ?? { collectionId: "" };

  const documents = await loadCollectionData(collectionId, tokenPayload);
  const collections = await handleCollectionData(await loadCollectionsData(tokenPayload));

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