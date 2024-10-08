import { cookies } from "next/headers";
import mongoose from "mongoose";

import { verifyToken } from "@/utils/token";
import sendModel from "@/models/send";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  let response: { json: any, status: number } = { json: null, status: 501 };
  const { searchParams } = new URL(request.url);
  let send;

  if (searchParams.size === 0) {
    send = await sendModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" });
  }
  else {
    let refCollection = searchParams.get('refCollection');
    let refDocument = searchParams.get('refDocument');
    send = await sendModel.aggregate()
      .match({ refCollection: new mongoose.Types.ObjectId(refCollection ?? ''), refDocument: new mongoose.Types.ObjectId(refDocument ?? '') })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "receives", localField: "_id", foreignField: "refSend", as: "receives" })
      .lookup({ from: "people", localField: "receives.refPerson", foreignField: "_id", as: "receivers" })
      .lookup({ from: "roles", localField: "receives.refRole", foreignField: "_id", as: "receiversRole" })
      .lookup({ from: "urgencies", localField: "receives.refUrgency", foreignField: "_id", as: "urgency" })
      .project({
        "person.firstName": 1, "person.lastName": 1, "role.title": 1, "receivers.firstName": 1, "receivers.lastName": 1, "sendDate": 1,
        "receiversRole.title":1, "urgency.title": 1, "receives.comment": 1, "receives.viewDate": 1, "receives.lastViewedDate": 1
      })
  }

  response = send ? { json: send, status: 200 } : { json: { message: "not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}


const POST = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { refPerson, refRole, refCollection, refDocument, sendDate, parentReceive } = await request.json();

  const send = await sendModel.create({ refPerson, refRole, refCollection, refDocument, ipAddress: (request.headers.get('X-Forwarded-For'))?.split(":").reverse()[0], sendDate, parentReceive });

  if (send) {
    return Response.json({ message: "Document sent successfully", _id: send._id }, { status: 201 });
  }
  return Response.json({ message: "Document was not sent" }, { status: 500 });
}

export {
  GET,
  POST
}