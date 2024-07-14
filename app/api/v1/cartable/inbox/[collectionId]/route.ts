import receiveModel from "@/models/receive";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";

const GET = async (request: Request, { params }: { params: { collectionId: string } }) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  if (typeof tokenPayload !== "string") {
    const receive = await receiveModel.aggregate()
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "people", localField: "send.refPerson", foreignField: "_id", as: "sender" })
      .lookup({ from: "collections", localField: "send.refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .lookup({ from: "urgencies", localField: "refUrgency", foreignField: "_id", as: "urgency" })
      .match({ "person.account.username": tokenPayload.username })
      .match({ "send.refCollection": new mongoose.Types.ObjectId(params.collectionId) })
      .project({ "sender.firstName": 1, "sender.lastName": 1, "role.title": 1, "collection.showTitle": 1, "urgency.title": 1, "send.sendDate": 1, "observed": 1, "viewDate": 1, "lastViewedDate": 1, })
      .unwind("$sender")
      .unwind("$send")
      .unwind("$collection")
      .unwind("$role")
      .unwind("$urgency")

    if (receive) {
      return Response.json(receive, { status: 200 });
    }
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}