import permissionModel from "@/models/permission";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

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