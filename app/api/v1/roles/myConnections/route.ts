import mongoose from "mongoose";
import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import roleModel from "@/models/role";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("roleId");
  const root = searchParams.get("root");

  if (!roleId || !root) {
    return Response.json({ message: "roleId and root are required" }, { status: 403 })
  }

  const roles = await roleModel.aggregate()
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .match({
      $or: [
        { root: root !== "null" ? new mongoose.Types.ObjectId(root) : "" },
        { root: new mongoose.Types.ObjectId(roleId ?? "") },
        { _id: root !== "null" ? new mongoose.Types.ObjectId(root) : "" }
      ]
    })
    .project({ "title": 1, "root": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1, "person.avatar": 1 })
    .unwind("person")

  if (roles) {
    return Response.json(roles, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}