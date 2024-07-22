import { cookies } from "next/headers";

import receiveModel from "@/models/receive";
import connectToDB from "@/utils/db";
import { verifyToken } from "@/utils/token";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("roleId");
  const showTitle = searchParams.get("showtitle");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 })
  }

  if (typeof tokenPayload !== "string") {
    const getType = request.headers.get("Get-Type");
    if (getType === "all") {
      const receive = await receiveModel.aggregate()
        .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
        .lookup({ from: "collections", localField: "send.refCollection", foreignField: "_id", as: "collection" })
        .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
        // .match({ "collection.showTitle": showTitle && { $regex: `.*${showTitle}.*` } })
        .match({ "person.account.username": tokenPayload.username })
        .match({ refRole: new mongoose.Types.ObjectId(roleId ?? "") })
        .project({ "collection._id": 1, "collection.showTitle": 1 })
        .group({ _id: { "_id": "$collection._id", "showTitle": "$collection.showTitle" } })
        return Response.json(receive, { status: 200 });
    }
    else if (getType === "nonObserved") {

      const receive = await receiveModel.aggregate()
        .match({ observed: false })
        .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
        .lookup({ from: "collections", localField: "send.refCollection", foreignField: "_id", as: "collection" })
        .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
        // .match({ "collection.showTitle": showTitle && { $regex: `.*${showTitle}.*` } })
        .match({ "person.account.username": tokenPayload.username })
        .match({ refRole: new mongoose.Types.ObjectId(roleId ?? "") })
        .project({ "collection._id": 1 })
        .group({ _id: { "_id": "$collection._id" }, count: { $sum: 1 } })
      return Response.json(receive, { status: 200 });
    }
  }
  return Response.json({ message: "not found" }, { status: 404 })
}

export {
  GET
}