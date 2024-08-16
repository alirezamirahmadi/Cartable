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

  const { title, refPerson, isActive } = await request.json();
  if (refPerson) {
    await roleModel.updateMany({ refPerson }, { isDefault: false })
  }
  else {
    const tempRole = await roleModel.findById(params.roleId);
    const personRoles = tempRole && await roleModel.find({ _id: { $ne: params.roleId }, refPerson: tempRole.refPerson });
    personRoles && await roleModel.findByIdAndUpdate(personRoles[0]._id, { $set: { isDefault: true } })
  }

  const role = await roleModel.findByIdAndUpdate(params.roleId, { $set: { title, refPerson, isDefault: refPerson ? true : false, isActive } });

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