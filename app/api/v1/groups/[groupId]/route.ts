import mongoose from "mongoose";
import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import groupModel from "@/models/group";
import groupMemberModel from "@/models/groupMember";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { groupId: string } }) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const groups = await groupModel.find({ root: params.groupId !== "-1" ? new mongoose.Types.ObjectId(params.groupId) : null });

  if (groups) {
    return Response.json(groups, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { groupId: string } }) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { title, root } = await request.json();

  const group = await groupModel.findByIdAndUpdate(params.groupId, { $set: { title, root } });

  if (group) {
    return Response.json({ message: "Group updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Group was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { groupId: string } }) => {
  connectToDB();

  const token = cookies().get("token");
  const tokenPayload = verifyToken(token?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const groups = await groupModel.find({ root: new mongoose.Types.ObjectId(params.groupId) });
  if (groups.length > 0) {
    return Response.json({ message: "Group was not deleted because of its children" }, { status: 403 })
  }

  const groupMembers = await groupMemberModel.find({ refGroup: new mongoose.Types.ObjectId(params.groupId) });
  if (groupMembers.length > 0) {
    return Response.json({ message: "Group was not deleted because of its children" }, { status: 403 })
  }

  const group = await groupModel.findByIdAndDelete(params.groupId);
  if (group) {
    return Response.json({ message: "Group deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Group was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}