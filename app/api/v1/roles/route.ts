import roleModel from "@/models/role";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const root = searchParams.get("root");
  const title = searchParams.get("title");
  const roles = (!root && !title)
    ?
    await roleModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ isActive: true })
      .unwind("person")
    :
    await roleModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match(title ? { title: { $regex: `.*${title}.*` } } : { root: root !== "-1" ? new mongoose.Types.ObjectId(root ?? "") : null })
      .unwind({ path: "$person", preserveNullAndEmptyArrays: true })

  // else {
  //   roles = await roleModel.aggregate()
  //     .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
  //     .match(title ? { title: {$regex:`.*${title}.*`}} : { root: root !== "-1" ? new mongoose.Types.ObjectId(root) : null })
  //     .unwind({ path: "$person", preserveNullAndEmptyArrays: true })
  // }

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