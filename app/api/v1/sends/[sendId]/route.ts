import sendModel from "@/models/send";

const GET = async (request: Request, { params }: { params: { sendId: string } }) => {
  const send = await sendModel.findById(params.sendId);

  if (send) {
    return Response.json(send, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { sendId: string } }) => {
  const { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, receivers } = await request.json();

  const send = await sendModel.findByIdAndUpdate(params.sendId, { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, receivers });

  if (send) {
    return Response.json({ message: "The submition was updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "The submition was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { sendId: string } }) => {
  const send = await sendModel.findByIdAndDelete(params.sendId);

  if (send) {
    return Response.json({ message: "Submition was deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Submition was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}