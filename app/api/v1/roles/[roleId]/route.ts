import roleModel from "@/models/role";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { roleId: string } }) => {
  connectToDB();
  
  const role = await roleModel.findById(params.roleId);
  
  if (role) {
    return Response.json(role, { status: 200 });
  }
  return Response.json({ message: "Role not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { roleId: string } }) => {
  connectToDB();
  
  const { title, refPerson, root, isDefault, isActive } = await request.json();
  
  const role = await roleModel.findByIdAndUpdate(params.roleId, { title, refPerson, root, isDefault, isActive });
  
  if (role) {
    return Response.json({ message: "Role updated successfully" }, { status: 201 })
  }
  return Response.json({ message: "Role was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { roleId: string } }) => {
  connectToDB();

  const role = await roleModel.findByIdAndDelete(params.roleId);

  if (role) {
    return Response.json({ message: "Role deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Role was not deleted" }, { status: 500 })
}

export {
  GET,
  PUT,
  DELETE
}