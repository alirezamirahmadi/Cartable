import sendModel from "@/models/send";
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
    const sends = await sendModel.aggregate()
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .match({ "refCollection": new mongoose.Types.ObjectId(params.collectionId) })
      .project({ "collection.showTitle": 1, "sendDate": 1, "refDocument": 1, "parentReceive": 1 })
      .unwind("$collection")

    if (sends) {
      return Response.json(sends, { status: 200 });
    }
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}