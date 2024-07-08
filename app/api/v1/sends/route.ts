import sendModel from "@/models/send";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

const GET = async (request: Request) => {
  connectToDB();

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
      // send = await sendModel.find({ refCollection, refDocument }).exec();
      send = await sendModel.aggregate()
      .match({ refCollection: new mongoose.Types.ObjectId(refCollection ?? ''), refDocument: new mongoose.Types.ObjectId(refDocument ?? '') })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" });
  }

  response = send ? { json: send, status: 200 } : { json: { message: "not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}


const POST = async (request: Request) => {
  connectToDB();

  const { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, parentReceive } = await request.json();

  const send = await sendModel.create({ refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, parentReceive });

  if (send) {
    return Response.json({ message: "Document sent successfully" }, { status: 201 });
  }
  return Response.json({ message: "Document was not sent" }, { status: 500 });
}

export {
  GET,
  POST
}