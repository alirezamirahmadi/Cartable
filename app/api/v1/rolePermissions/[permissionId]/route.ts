import mongoose from "mongoose";

import roleModel from "@/models/role";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { permissionId: string } }) => {
  connectToDB();

  const roles = await roleModel.aggregate()
    .match({ permissions: new mongoose.Types.ObjectId(params.permissionId) })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .project({ "title": 1, "root": 1, "isActive": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1 })
    .unwind("person")

  if (roles) {
    return Response.json({ roles }, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}