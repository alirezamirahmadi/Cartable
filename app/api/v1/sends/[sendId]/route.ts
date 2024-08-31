import { cookies } from "next/headers";
import mongoose from "mongoose";

import { verifyToken } from "@/utils/token";
import sendModel from "@/models/send";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { sendId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const send = await sendModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(params.sendId) })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
    .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" });

  if (send) {
    return Response.json(send, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { sendId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, parentReceive } = await request.json();

  const send = await sendModel.findByIdAndUpdate(params.sendId, { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, parentReceive });

  if (send) {
    return Response.json({ message: "Submition updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Submition was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { sendId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const send = await sendModel.findByIdAndDelete(params.sendId);

  if (send) {
    return Response.json({ message: "Submition deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Submition was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}