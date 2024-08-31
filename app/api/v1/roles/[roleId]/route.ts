import mongoose from "mongoose";
import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import roleModel from "@/models/role";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { roleId: string } }) => {
  connectToDB();
  
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const role = await roleModel.findById(params.roleId);

  if (role) {
    return Response.json(role, { status: 200 });
  }
  return Response.json({ message: "Role not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { roleId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { title, refPerson, isActive } = await request.json();
  if (refPerson) {
    await roleModel.updateMany({ refPerson }, { isDefault: false })
  }
  else {
    const tempRole = await roleModel.findById(params.roleId);
    const personRoles = tempRole && await roleModel.find({ _id: { $ne: params.roleId }, refPerson: tempRole.refPerson });
    personRoles?.length > 0 && await roleModel.findByIdAndUpdate(personRoles[0]._id, { $set: { isDefault: true } })
  }

  const role = await roleModel.findByIdAndUpdate(params.roleId, { $set: { title, refPerson, isDefault: refPerson ? true : false, isActive } });

  if (role) {
    return Response.json({ message: "Role updated successfully" }, { status: 201 })
  }
  return Response.json({ message: "Role was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { roleId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const roleUsed = await roleModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(params.roleId) })
    .lookup({ from: "groupmembers", localField: "_id", foreignField: "refRole", as: "groupmembers" })
    .lookup({ from: "sends", localField: "_id", foreignField: "refRole", as: "sends" })
    .lookup({ from: "receives", localField: "_id", foreignField: "refRole", as: "receives" })

  if (roleUsed[0].groupmembers.length > 0 || roleUsed[0].sends.length > 0 || roleUsed[0].receives.length > 0 || roleUsed[0].refPerson !== null) {
    return Response.json({ message: "This role used in groupmembers/send/receive or has a person" }, { status: 403 })
  }

  const role = await roleModel.findByIdAndDelete(params.roleId);

  if (role) {
    return Response.json({ message: "Role deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Role was not deleted" }, { status: 500 })
}

export {
  GET,
  PUT,
  DELETE
}