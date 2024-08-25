import { cookies } from "next/headers";

import sendModel from "@/models/send";
import { verifyToken } from "@/utils/token";

const GET = async () => {

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 })
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

    if (sends) {
      return Response.json(sends, { status: 200 });
    }
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}