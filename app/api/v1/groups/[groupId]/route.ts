import mongoose from "mongoose";

import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { groupId: string } }) => {
  connectToDB();

  const groups = await groupModel.find({ root: params.groupId !== "-1" ? new mongoose.Types.ObjectId(params.groupId) : null });

  if (groups) {
    return Response.json(groups, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { groupId: string } }) => {
  connectToDB();

  const { title, root, kind } = await request.json();

  const group = await groupModel.findByIdAndUpdate(params.groupId, { title, root, kind });

  if (group) {
    return Response.json({ message: "Group updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Group was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { groupId: string } }) => {
  connectToDB();

  const groups = await groupModel.find({ root: new mongoose.Types.ObjectId(params.groupId) });
  if (groups.length > 0) {
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