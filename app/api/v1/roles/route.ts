import roleModel from "@/models/role";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const root = searchParams.get("root");

  const roles = !root
    ?
    await roleModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ isActive: true })
      .unwind("person")
    :
    await roleModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ root: root !== "-1" ? new mongoose.Types.ObjectId(root) : null })
      .unwind("person")
console.log(roles)
  if (roles) {
    return Response.json(roles, { status: 200 });
  }
  return Response.json({ message: "Roles not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  const { title, refPerson, root, isActive } = await request.json();

  const role = await roleModel.create({ title, refPerson, root, isActive });

  if (role) {
    return Response.json({ message: "Role created successfully" }, { status: 201 });
  }
  return Response.json({ message: "Role was not created" }, { status: 500 });
}

export {
  GET,
  POST
}