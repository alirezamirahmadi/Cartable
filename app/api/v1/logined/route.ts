import loginedModel from "@/models/logined";

const GET = async () => {
  const logined = await loginedModel.find();

  if (logined) {
    return Response.json(logined, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  const { refPerson, ipAddress, loginDate } = await request.json();

  const logined = await loginedModel.create({ refPerson, ipAddress, loginDate });

  if (logined) {
    return Response.json({ message: "The person was logined successfully" }, { status: 200 });
  }
  return Response.json({ message: "The person was not logined" }, { status: 500 });
}

export {
  GET,
  POST
}