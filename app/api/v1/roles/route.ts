import roleModel from "@/models/role";

const GET = async () => {
  const roles = await roleModel.find();

  if (roles) {
    return Response.json(roles, { status: 200 });
  }
  return Response.json({ message: "Roles not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  const { title, root, isActive } = await request.json();

  const role = await roleModel.create({ title, root, isActive });

  if (role) {
    return Response.json({ message: "The role was successfully created" }, { status: 201 });
  }
  return Response.json({ message: "The role was not created" }, { status: 500 });
}

export {
  GET,
  POST
}