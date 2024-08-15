import { cookies } from "next/headers";

import personModel from "@/models/person";
import roleModel from "@/models/role";
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
      .unwind("roles")
      .match({ "roles.isActive": true })
      .match({ "roles.isDefault": true })
      .lookup({ from: "groupmembers", localField: "roles._id", foreignField: "refRole", as: "groupmember" })
      .lookup({ from: "groups", localField: "groupmember.refGroup", foreignField: "_id", as: "groups" })
      .project({
        "firstName": 1, "lastName": 1, "roles._id": 1, "roles.root": 1, "roles.title": 1, "roles.isDefault": 1,
        "roles.permissions": 1, "groups.permissions": 1
      })
      .addFields({ "permissions": []})
      .limit(1);

    const groupsPermission = new Set();
    person[0].groups.map((group: any) => group.permissions.map((permission: any) => groupsPermission.add(permission.toString())))
    person[0].roles.permissions.map((permission: any) => groupsPermission.add(permission.toString()))

    person[0].roles.permissions = null;
    person[0].groups = null;
    person[0].permissions = Array.from(groupsPermission);

    return person && Response.json(person[0], { status: 200 });
  }

  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request) => {
  const { refPerson, defaultRoleId } = await request.json();

  const allRole = await roleModel.updateMany({ refPerson }, { $set: { isDefault: false } });
  const defaultRole = await roleModel.updateOne({ _id: defaultRoleId }, { $set: { isDefault: true } });

  if (allRole && defaultRole) {
    return Response.json({ message: "Default role changed successfully" }, { status: 201 });
  }
  return Response.json({ message: "Default role did not change" }, { status: 500 });
}

export {
  GET,
  PUT
}