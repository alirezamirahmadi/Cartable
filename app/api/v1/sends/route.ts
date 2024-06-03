import sendModel from "@/models/send";

const GET = async () => {
  const sends = await sendModel.find();

  if (sends) {
    return Response.json(sends, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const POST = async (request: Request, { params }: { params: { sendId: string } }) => {
  const { refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, receivers } = await request.json();

  const send = await sendModel.create({ refPerson, refRole, refCollection, refDocument, ipAddress, sendDate, receivers });

  if (send) {
    return Response.json({ message: "The document was sent successfully" }, { status: 201 });
  }
  return Response.json({ message: "The document was not sent" }, { status: 500 });
}

export {
  GET,
  POST
}