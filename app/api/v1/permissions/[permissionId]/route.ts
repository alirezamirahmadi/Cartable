import mongoose from "mongoose";

import permissionModel from "@/models/permission";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { permissionId: string } }) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const item = searchParams.get("item");

  const permissions = await permissionModel.find(
    {
      root: params.permissionId !== "null" ? new mongoose.Types.ObjectId(params.permissionId) : null,
      kind: item && item === "true" ? 3 : { $in: [1, 2] }
    }
  );
  if (permissions) {
    return Response.json(permissions, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}