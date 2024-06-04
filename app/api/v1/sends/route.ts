import sendModel from "@/models/send";

const GET = async (request: Request) => {

  let response: { json: any, status: number } = { json: null, status: 501 };
  const { searchParams } = new URL(request.url);
  let send;

  if (searchParams.size === 0) {
    send = await sendModel.find();
  }
  else {
    let refCollection = searchParams.get('refCollection');
    let refDocument = searchParams.get('refDocument');
    send = await sendModel.find({ refCollection, refDocument }).exec();
  }
  
  send ? response = { json: send, status: 200 } : response = { json: { message: "not found" }, status: 404 }
  return Response.json(response.json, { status: response.status });
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