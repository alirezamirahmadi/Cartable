import { cookies } from "next/headers";
import { verifyToken } from "@/utils/token";

import { inboxCollections } from "@/actions/cartable";
import type { CollectionListType } from "@/types/cartableType";
import NewCollectionsList from "@/components/home/newCollectionsList/newCollectionsList";

export default async function Home() {

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  const collections: CollectionListType[] = await inboxCollections(tokenPayload);

  return (
    <>
      <NewCollectionsList collections={collections} />
    </>
  )
}
