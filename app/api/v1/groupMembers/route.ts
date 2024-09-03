import mongoose from "mongoose";
import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import groupMemberModel from "@/models/groupMember";
import roleModel from "@/models/role";
import groupModel from "@/models/group";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const refGroup = searchParams.get("refGroup");
  const refRole = searchParams.get("refRole");

  const members = refGroup && await roleModel.aggregate()
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .lookup({ from: "groupmembers", localField: "_id", foreignField: "refRole", as: "groupmember" })
    .match({ "groupmember.refGroup": new mongoose.Types.ObjectId(refGroup ?? "") })
    .project({
      "title": 1, "root": 1, "isActive": 1,
      "person._id": 1, "person.firstName": 1, "person.lastName": 1, "person.image": 1
    })
    .unwind("person")

  const groups = refRole && await groupModel.aggregate()
    .lookup({ from: "groupmembers", localField: "_id", foreignField: "refGroup", as: "membergroup" })
    .match({ "membergroup.refRole": new mongoose.Types.ObjectId(refRole) })
    .project({ "title": 1, "root": 1, "kind": 1 })

  if (members) {
    return Response.json(members, { status: 200 });
  }
  if (groups) {
    return Response.json(groups, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { refGroup, refRole } = await request.json();

  const duplicate = await groupMemberModel.find({ refGroup, refRole });
  if (duplicate.length > 0) {
    return Response.json({ message: "The member is duplicate" }, { status: 403 });
  }

  const member = await groupMemberModel.create({ refGroup, refRole });
  if (member) {
    return Response.json({ message: "Member added sucessfully" }, { status: 201 })
  }
  return Response.json({ message: "Member was not add" }, { status: 500 })
}

const DELETE = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

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