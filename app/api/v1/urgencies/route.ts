import urgencyModel from "@/models/urgency";
import connectToDB from "@/utils/db";

const GET = async () => {
  connectToDB();

  const urgencies = await urgencyModel.find();

  if (urgencies) {
    return Response.json(urgencies, { status: 200 });
  }
  return Response.json({ message: "Urgencies not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  const { title } = await request.json();

  const urgency = await urgencyModel.create({ title });

  if (urgency) {
    return Response.json({ message: "The urgency was created successfully" }, { status: 201 });
  }
  return Response.json({ message: "The urgency was not created" }, { status: 500. });
}

export {
  GET,
  POST
}