import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import urgencyModel from "@/models/urgency";
import connectToDB from "@/utils/db";

const GET = async () => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const urgencies = await urgencyModel.find();

  if (urgencies) {
    return Response.json(urgencies, { status: 200 });
  }
  return Response.json({ message: "Urgencies not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { title } = await request.json();

  const urgency = await urgencyModel.create({ title });

  if (urgency) {
    return Response.json({ message: "Urgency created successfully" }, { status: 201 });
  }
  return Response.json({ message: "Urgency was not created" }, { status: 500. });
}

export {
  GET,
  POST
}