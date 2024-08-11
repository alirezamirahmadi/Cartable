import mongoose from "mongoose";

import roleModel from "@/models/role";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("roleId");

  const permissions = await roleModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(roleId ?? "") })
    .project({ "_id": 0, "permissions": 1 })

  if (permissions) {
    return Response.json(permissions, { status: 200 });
  }
  return Response.json({ message: "roleId is required and must be valid" }, { status: 500 });
}

const POST = async (request: Request) => {
  connectToDB();

  const { roleId, permissionIds } = await request.json();
  const permissions = await roleModel.findByIdAndUpdate(roleId, { $addToSet: { permissions: permissionIds } });

  if (permissions) {
    return Response.json({ message: "Permissions added successfully" }, { status: 201 });
  }
  return Response.json({ message: "Permissions did not add" }, { status: 500 });
}

const DELETE = async (request: Request) => {
  connectToDB();

  const { roleId, permissionIds } = await request.json();
  const permissions = await roleModel.findByIdAndUpdate(roleId, { $pullAll: { permissions: permissionIds } });

  if (permissions) {
    return Response.json({ message: "Permissions deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Permissions did not delete" }, { status: 500 });
}

export {
  GET,
  POST,
  DELETE
}