import receiveModel from "@/models/receive";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request, { params }: { params: { receiveId: string } }) => {
  connectToDB();

  const receive = await receiveModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(params.receiveId) })
    .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
    .lookup({ from: "urgencies", localField: "refUrgency", foreignField: "_id", as: "urgency" });

  if (receive) {
    return Response.json(receive, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { receiveId: string } }) => {
  connectToDB();

  const { refSend, refPerson, refRole, refUrgency, viewDate, lastViewedDate, comment, observed } = await request.json();

  const receive = await receiveModel.findByIdAndUpdate(params.receiveId,
    { $set: { observed, viewDate, lastViewedDate } });
  // { refSend, refPerson, refRole, refUrgency, viewDate, lastViewedDate, comment, observed });

  if (receive) {
    return Response.json({ message: "Receive updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Receive was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { receiveId: string } }) => {
  connectToDB();

  const receive = await receiveModel.findByIdAndDelete(params.receiveId);

  if (receive) {
    return Response.json({ message: "Receive deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Receive was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}