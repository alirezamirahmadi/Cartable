import groupMemberModel from "@/models/groupMember";
import roleModel from "@/models/role";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const refGroup = searchParams.get("refGroup");

  const members = await roleModel.aggregate()
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .lookup({ from: "groupmembers", localField: "_id", foreignField: "refRole", as: "groupmember" })
    .match({ "groupmember.refGroup": new mongoose.Types.ObjectId(refGroup ?? "") })
    .project({
      "title": 1, "root": 1, "isActive": 1,
      "person._id": 1, "person.firstName": 1, "person.lastName": 1
    })
    .unwind("person")

  if (members) {
    return Response.json(members, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  const { refGroup, refRole } = await request.json();

  const member = await groupMemberModel.create({ refGroup, refRole });
  if (member) {
    return Response.json({ message: "Member added sucessfully" }, { status: 201 })
  }
  return Response.json({ message: "Member was not add" }, { status: 500 })
}

const DELETE = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const refGroup = searchParams.get("refGroup");
  const refRole = searchParams.get("refRole");

  const member = await groupMemberModel.findOneAndDelete({ refGroup: new mongoose.Types.ObjectId(refGroup ?? ""), refRole: new mongoose.Types.ObjectId(refRole ?? "") })
  if (member) {
    return Response.json({ message: "Member deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Member was not delete" }, { status: 500 });
}

export {
  GET,
  POST,
  DELETE
}