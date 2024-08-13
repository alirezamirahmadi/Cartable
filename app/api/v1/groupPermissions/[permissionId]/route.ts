import mongoose from "mongoose";

import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { permissionId: string } }) => {
  connectToDB();

  const groups = await groupModel.aggregate()
    .match({ permissions: new mongoose.Types.ObjectId(params.permissionId) })
    .project({ "title": 1 })

  if (groups) {
    return Response.json(groups, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}