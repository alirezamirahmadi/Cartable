import { cookies } from "next/headers";

import receiveModel from "@/models/receive";
import connectToDB from "@/utils/db";
import { verifyToken } from "@/utils/token";

const GET = async (request: Request) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

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
        .match({ "person.account.username": tokenPayload.username })
        .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
        .match({ "role.isDefault": true })
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
        .match({ "person.account.username": tokenPayload.username })
        .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
        .match({ "role.isDefault": true })
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