import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();
  
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const kind = searchParams.get("kind");
  let groups = null;

  if (title && !kind) groups = await groupModel.find({ title: { $regex: `.*${title}.*` } });
  else if (!title && kind) groups = await groupModel.find({ kind });
  else if (title && kind) groups = await groupModel.find({ title: { $regex: `.*${title}.*` }, kind });
  else groups = await groupModel.find();

  if (groups) {
    return Response.json(groups, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}


const POST = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { title, root, kind } = await request.json();

  const group = await groupModel.create({ title, root, kind });

  if (group) {
    return Response.json({ message: "Group created successfully" }, { status: 201 })
  }
  return Response.json({ message: "Group is not create" }, { status: 500 })
}

const PUT = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { groupIds, root } = await request.json();
  const group = await groupModel.updateMany({ _id: { $in: groupIds } }, { $set: { root } });

  if (group) {
    return Response.json({ message: "Groups updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Groups did not update" }, { status: 500 });
}

export {
  GET,
  POST,
  PUT
}