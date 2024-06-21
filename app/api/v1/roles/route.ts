import roleModel from "@/models/role";
import connectToDB from "@/utils/db";

const GET = async () => {
  connectToDB();
  
  const roles = await roleModel.find();
  
  if (roles) {
    return Response.json(roles, { status: 200 });
  }
  return Response.json({ message: "Roles not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  const { title, root, isActive } = await request.json();

  const role = await roleModel.create({ title, root, isActive });

  if (role) {
    return Response.json({ message: "Role created successfully" }, { status: 201 });
  }
  return Response.json({ message: "Role was not created" }, { status: 500 });
}

export {
  GET,
  POST
}