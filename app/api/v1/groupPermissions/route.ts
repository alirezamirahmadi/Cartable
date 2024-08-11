import mongoose from "mongoose";

// import groupPermissionModel from "@/models/groupPermission";
import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  // const refPermission = searchParams.get("refPermission");
  const groupId = searchParams.get("groupId");

  // const permissions = await groupPermissionModel.find(refPermission
  //   ? { refPermission: new mongoose.Types.ObjectId(refPermission) }
  //   : { refGroup: new mongoose.Types.ObjectId(refGroup ?? "") }
  // )

  const permissions = await groupModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(groupId ?? "") })
    .project({ "_id": 0, "permissions": 1 })


  if (permissions) {
    return Response.json(permissions, { status: 200 });
  }
  return Response.json({ message: "groupId is required and must be valid" }, { status: 500 });
}

const POST = async (request: Request) => {
  connectToDB();

  // const {permissions} = await request.json();
  // const newPermissions = await groupPermissionModel.insertMany(permissions);
  const { groupId, permissionIds } = await request.json();
  const newPermissions = await groupModel.findByIdAndUpdate(groupId, { $addToSet: { permissions: permissionIds } })

  if (newPermissions) {
    return Response.json({ message: "Permissions added successfully" }, { status: 201 });
  }
  return Response.json({ message: "Permissions did not add" }, { status: 500 });
}

const DELETE = async (request: Request) => {
  connectToDB();

  // const permissions = await request.json();
  // const deletedPermissions = await groupPermissionModel.deleteMany(permissions);
  const { groupId, permissionIds } = await request.json();
  const deletedPermissions = await groupModel.findByIdAndUpdate(groupId, { $pullAll: { permissions: permissionIds } })

  if (deletedPermissions) {
    return Response.json({ message: "Permissions deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Permissions did not create" }, { status: 500 });
}

export {
  GET,
  POST,
  DELETE
}