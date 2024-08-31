import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import permissionModel from "@/models/permission";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();
  
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const showTitle = searchParams.get("showTitle");

  const permissions = await permissionModel.find({ showTitle: { $regex: `.*${showTitle}.*` }, kind: { $in: [1, 2] } });
  if (permissions) {
    return Response.json(permissions, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}