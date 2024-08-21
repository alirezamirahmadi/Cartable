import { cookies } from "next/headers";

import personModel from "@/models/person";
import { verifyToken } from "@/utils/token";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (typeof tokenPayload !== "string") {
    const permissionInRole = await personModel.aggregate()
      .match({ "account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
      .lookup({ from: "permissions", localField: "roles.permissions", foreignField: "_id", as: "rolepermissions" })
      .unwind("roles")
      .match({ "rolepermissions.title": { $in: ["gnr.role.update"] } })
      .match({ "roles.isDefault": true })
      .project({ "_id": 0, "rolepermissions.title": 1 })
      
      if (permissionInRole.length > 0) {
      return Response.json(permissionInRole, { status: 200 });
    }

    const permissionInGroups = await personModel.aggregate()
      .match({ "account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
      .unwind("roles")
      .match({ "roles.isDefault": true })
      .lookup({ from: "groupmembers", localField: "roles._id", foreignField: "refRole", as: "groupmembers" })
      .lookup({ from: "groups", localField: "groupmembers.refGroup", foreignField: "_id", as: "groups" })
      .lookup({ from: "permissions", localField: "groups.permissions", foreignField: "_id", as: "grouppermissions" })
      .unwind("groups")
      .match({ "grouppermissions.title": { $in: ["gnr.role.update"] } })
      .project({ "_id": 0, "grouppermissions.title": 1 })

    if (permissionInGroups.length > 0) {
      return Response.json(permissionInGroups, { status: 200 })
    }
  }
  return Response.json({ message: "not found" }, { status: 404 })
}

export {
  GET
}