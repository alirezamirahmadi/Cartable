import receiveModel from "@/models/receive";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

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
    let refUrgency = searchParams.get('refUrgency');
    receive = await receiveModel.aggregate()
      .match({ refUrgency: new mongoose.Types.ObjectId(refUrgency ?? '') })
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .lookup({ from: "urgencies", localField: "refUrgency", foreignField: "_id", as: "urgency" });
  }

  response = receive ? { json: receive, status: 200 } : { json: { message: "not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}


const POST = async (request: Request) => {
  connectToDB();

  const { refSend, refPerson, refRole, refUrgency, viewDate, lastViewedDate, comment, observed } = await request.json();

  const send = await receiveModel.create({ refSend, refPerson, refRole, refUrgency, viewDate, lastViewedDate, comment, observed });

  if (send) {
    return Response.json({ message: "Document receive successfully" }, { status: 201 });
  }
  return Response.json({ message: "Document was not receive" }, { status: 500 });
}

export {
  GET,
  POST
}