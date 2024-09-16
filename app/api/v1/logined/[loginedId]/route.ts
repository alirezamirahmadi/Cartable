import { cookies } from "next/headers";
import mongoose from "mongoose";

import { verifyToken } from "@/utils/token";
import loggedModel from "@/models/logged";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { loginedId: string } }) => {
  connectToDB();
    
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const logined = await loggedModel.aggregate()
    .match({ _id: { $eq: new mongoose.Types.ObjectId(params.loginedId) } })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" });

  if (logined) {
    return Response.json(logined, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const DELETE = async (request: Request, { params }: { params: { loginedId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const logined = await loggedModel.findByIdAndDelete(params.loginedId);

  if (logined) {
    return Response.json({ message: "The person is logged out" }, { status: 200 });
  }
  return Response.json({ message: "The person is not logged out" }, { status: 500 });
}

export {
  GET,
  DELETE
}