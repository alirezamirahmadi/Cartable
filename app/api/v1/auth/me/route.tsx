import { cookies } from "next/headers";

import personModel from "@/models/person";
import { verifyToken } from "@/utils/token";
import connectToDB from "@/utils/db";

const GET = async () => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  if (typeof tokenPayload !== "string") {
    const person = await personModel.aggregate()
      .match({ "account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
      .match({ "roles.isActive": true })
      .project({ "firstName": 1, "lastName": 1, "roles": 1 })
      .limit(1);
    return person && Response.json(person[0], { status: 200 });
  }

  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}