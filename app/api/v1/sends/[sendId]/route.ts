import sendModel from "@/models/send";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request, { params }: { params: { sendId: string } }) => {
  connectToDB();

  // const send = await sendModel.findById(params.sendId);
  const send = await sendModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(params.sendId) })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
    .lookup({ from: "people", localField: "receivers.refPerson", foreignField: "_id", as: "receiver.person" })
    .lookup({ from: "roles", localField: "receivers.refRole", foreignField: "_id", as: "receiver.role" })
    .lookup({ from: "urgencies", localField: "receivers.refUrgency", foreignField: "_id", as: "receiver.urgency" });

  if (send) {
    return Response.json(send, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { sendId: string } }) => {
  connectToDB();

  const { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, receivers } = await request.json();

  const send = await sendModel.findByIdAndUpdate(params.sendId, { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, receivers });

  if (send) {
    return Response.json({ message: "Submition updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Submition was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { sendId: string } }) => {
  connectToDB();

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