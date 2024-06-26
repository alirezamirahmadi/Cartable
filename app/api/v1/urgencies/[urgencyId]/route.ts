import urgencyModel from "@/models/urgency";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { urgencyId: string } }) => {
  connectToDB();

  const urgency = await urgencyModel.findById(params.urgencyId);

  if (urgency) {
    return Response.json(urgency, { status: 200 });
  }
  return Response.json({ message: "The urgency not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { urgencyId: string } }) => {
  connectToDB();

  const { title } = await request.json();

  const urgency = await urgencyModel.findByIdAndUpdate(params.urgencyId, { title });

  if (urgency) {
    return Response.json({ message: "Urgency updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Urgency was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { urgencyId: string } }) => {
  connectToDB();

  const urgency = await urgencyModel.findByIdAndDelete(params.urgencyId);

  if (urgencyModel) {
    return Response.json({ message: "Urgency deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Urgency was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}