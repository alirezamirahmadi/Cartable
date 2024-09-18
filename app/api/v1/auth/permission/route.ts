import personModel from "@/models/person";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ message: "Person is not login" }, { status: 401 })
  }

  const permissionInRole = await personModel.aggregate()
    .match({ "account.username": username })
    .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
    .unwind("roles")
    .match({ "roles.isActive": true })
    .match({ "roles.isDefault": true })
    .lookup({ from: "permissions", localField: "roles.permissions", foreignField: "_id", as: "rolepermissions" })
    .match({ "rolepermissions.title": { $in: [title] } })
    .project({ "_id": 0, "rolepermissions.title": 1 })

  if (permissionInRole.length > 0) {
    return Response.json({message:"The role has permission"}, { status: 200 });
  }

  const permissionInGroups = await personModel.aggregate()
    .match({ "account.username": username })
    .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
    .unwind("roles")
    .match({ "roles.isActive": true })
    .match({ "roles.isDefault": true })
    .lookup({ from: "groupmembers", localField: "roles._id", foreignField: "refRole", as: "groupmembers" })
    .lookup({ from: "groups", localField: "groupmembers.refGroup", foreignField: "_id", as: "groups" })
    .lookup({ from: "permissions", localField: "groups.permissions", foreignField: "_id", as: "grouppermissions" })
    .unwind("groups")
    .match({ "grouppermissions.title": { $in: [title] } })
    .project({ "_id": 0, "grouppermissions.title": 1 })

  if (permissionInGroups.length > 0) {
    return Response.json({message:"The role has permission"}, { status: 200 })
  }

  return Response.json({ message: "The role has not permission" }, { status: 403 })
}

export {
  GET
}