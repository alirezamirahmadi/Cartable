import roleModel from "@/models/role";

const GET = async (request: Request, { params }: { params: { roleId: string } }) => {
  const role = await roleModel.findById(params.roleId);

  if (role) {
    return Response.json(role, { status: 200 });
  }
  return Response.json({ message: "Role not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { roleId: string } }) => {
  const { title, root, isActive } = await request.json();

  const role = await roleModel.findByIdAndUpdate(params.roleId, { title, root, isActive });

  if (role) {
    return Response.json({ message: "The role was successfully updated" }, { status: 201 })
  }
  return Response.json({ message: "The role was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { roleId: string } }) => {
  const role = await roleModel.findByIdAndDelete(params.roleId);

  if (role) {
    return Response.json({ message: "Role deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "The role was not deleted" }, { status: 500 })
}

export {
  GET,
  PUT,
  DELETE
}