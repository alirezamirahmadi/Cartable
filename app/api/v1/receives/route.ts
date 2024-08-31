import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import receiveModel from "@/models/receive";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();
    
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  let response: { json: any, status: number } = { json: null, status: 501 };
  const { searchParams } = new URL(request.url);
  let receive;

  if (searchParams.size === 0) {
    receive = await receiveModel.aggregate()
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .lookup({ from: "urgencies", localField: "refUrgency", foreignField: "_id", as: "urgency" });
  }
  else {
    let refCollection = searchParams.get('refCollection');
    let refDocument = searchParams.get('refDocument');
    receive = await receiveModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "receiver" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "receiverRole" })
      .lookup({ from: "urgencies", localField: "refUrgency", foreignField: "_id", as: "urgency" })
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "people", localField: "send.refPerson", foreignField: "_id", as: "sender" })
      .lookup({ from: "roles", localField: "send.refRole", foreignField: "_id", as: "senderRole" })
      .match({ "send.refCollection": new mongoose.Types.ObjectId(refCollection ?? ''), "send.refDocument": new mongoose.Types.ObjectId(refDocument ?? '') })
      .project({
        "refSend": 1, "sender._id": 1, "sender.firstName": 1, "sender.lastName": 1, "senderRole.title": 1, "send.sendDate": 1,
        "receiver.firstName": 1, "receiver.lastName": 1, "receiverRole.title": 1, "urgency.title": 1, "comment": 1, "viewDate": 1, "lastViewedDate": 1
      })
      .unwind("send")
      .unwind("sender")
      .unwind("receiver")
      .unwind("senderRole")
      .unwind("receiverRole")
      .unwind("urgency")
  }

  response = receive ? { json: receive, status: 200 } : { json: { message: "not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}


const POST = async (request: Request) => {
  connectToDB();
  
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const receivers = await request.json();
  const receive = await receiveModel.insertMany(receivers);

  if (receive) {
    return Response.json({ message: "Document received successfully" }, { status: 201 });
  }
  return Response.json({ message: "Document was not receive" }, { status: 500 });
}

export {
  GET,
  POST
}