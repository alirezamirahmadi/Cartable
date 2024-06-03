import urgencyModel from "@/models/urgency";

const GET = async (request: Request, { params }: { params: { urgencyId: string } }) => {
  const urgency = await urgencyModel.findById(params.urgencyId);

  if (urgency) {
    return Response.json(urgency, { status: 200 });
  }
  return Response.json({ message: "The urgency not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { urgencyId: string } }) => {
  const { title } = await request.json();

  const urgency = await urgencyModel.findByIdAndUpdate(params.urgencyId, { title });

  if (urgency) {
    return Response.json({ message: "The urgency was successfully updated" }, { status: 201 });
  }
  return Response.json({ message: "The urgency was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { urgencyId: string } }) => {
  const urgency = await urgencyModel.findByIdAndDelete(params.urgencyId);

  if (urgencyModel) {
    return Response.json({ message: "Urgency deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "The urgency was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}