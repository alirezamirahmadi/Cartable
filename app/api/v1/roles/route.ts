import roleModel from "@/models/role";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const root = searchParams.get("root");
  const title = searchParams.get("title");
  const refPerson = searchParams.get("refPerson");
  let roles = null;
  if (!root && !title && !refPerson) {
    roles = await roleModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ isActive: true })
      .project({ "title": 1, "root": 1, "isActive": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1 })
      .unwind("person")
  }
  else if (root || title) {
    roles = await roleModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match(title ? { title: { $regex: `.*${title}.*` } } : { root: root !== "-1" ? new mongoose.Types.ObjectId(root ?? "") : null })
      .project({ "title": 1, "root": 1, "isActive": 1, "person._id": 1, "person.firstName": 1, "person.lastName": 1 })
      .unwind({ path: "$person", preserveNullAndEmptyArrays: true })
  }
  else if (refPerson) {
    roles = await roleModel.aggregate()
      .match({ isActive: true, refPerson: new mongoose.Types.ObjectId(refPerson ?? "") })
      .project({ "title": 1, "root": 1 })
  }

  if (roles) {
    return Response.json(roles, { status: 200 });
  }
  return Response.json({ message: "Roles not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  const { title, refPerson, root, isActive } = await request.json();

  refPerson && await roleModel.updateMany({ refPerson }, { isDefault: false });
  const role = await roleModel.create({ title, refPerson, root, isDefault: true, isActive, permissions:[] });

  if (role) {
    return Response.json({ message: "Role created successfully" }, { status: 201 });
  }
  return Response.json({ message: "Role was not created" }, { status: 500 });
}

const PUT = async (request: Request) => {
  const { roleIds, root } = await request.json();

  const role = await roleModel.updateMany({ _id: { $in: roleIds } }, { $set: { root } });
  if (role) {
    return Response.json({ message: "Roles updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Roles did not update" }, { status: 500 });
}

export {
  GET,
  POST,
  PUT
}