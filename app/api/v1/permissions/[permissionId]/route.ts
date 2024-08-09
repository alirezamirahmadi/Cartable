import mongoose from "mongoose";

import permissionModel from "@/models/permission";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { permissionId: string } }) => {
  connectToDB();

  const permissions = await permissionModel.find({ root: params.permissionId !== "null" ? new mongoose.Types.ObjectId(params.permissionId) : null });
  if (permissions) {
    return Response.json(permissions, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}