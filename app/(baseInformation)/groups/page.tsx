import { Suspense } from "react";

import Loading from "@/components/general/loading/loading";
import GroupTree from "@/components/group/groupTree";
import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

async function loadGroupData() {
  connectToDB();

  const groups = await groupModel.find();
  return JSON.parse(JSON.stringify(groups)) ?? [];
}

export default async function GroupsPage() {

  const groups = await loadGroupData();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <GroupTree groups={groups} />
      </Suspense>
    </>
  )
}