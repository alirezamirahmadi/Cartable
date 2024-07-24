import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

const POST = async (request: Request) => {
  connectToDB();

  const { title, root, kind } = await request.json();

  const group = await groupModel.create({ title, root, kind });

  if (group) {
    return Response.json({ message: "Group created successfully" }, { status: 201 })
  }
  return Response.json({ message: "Group is not create" }, { status: 500 })
}

export {
  POST
}