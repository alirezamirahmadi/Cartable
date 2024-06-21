import loginedModel from "@/models/logined";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request, { params }: { params: { loginedId: string } }) => {
  connectToDB();

  const logined = await loginedModel.aggregate()
    .match({ _id: { $eq: new mongoose.Types.ObjectId(params.loginedId) } })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" });

  if (logined) {
    return Response.json(logined, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const DELETE = async (request: Request, { params }: { params: { loginedId: string } }) => {
  connectToDB();
  const logined = await loginedModel.findByIdAndDelete(params.loginedId);

  if (logined) {
    return Response.json({ message: "The person is logged out" }, { status: 200 });
  }
  return Response.json({ message: "The person is not logged out" }, { status: 500 });
}

export {
  GET,
  DELETE
}