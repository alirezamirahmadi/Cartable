import loginedModel from "@/models/logined";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  let response: { json: any, status: number } = { json: null, status: 501 };
  const { searchParams } = new URL(request.url);
  let login;

  if (searchParams.size === 0) {
    login = await loginedModel.find();
  }
  else {
    let token = searchParams.get('token');
    login = await loginedModel.find({ token }).exec();
  }

  login ? response = { json: login, status: 200 } : response = { json: { message: "not found" }, status: 404 }
  return Response.json(response.json, { status: response.status });
}

const POST = async (request: Request) => {
  connectToDB();
  const { refPerson, ipAddress, loginDate, token } = await request.json();

  const logined = await loginedModel.create({ refPerson, ipAddress, loginDate, token });

  if (logined) {
    return Response.json({ message: "The person was logined successfully" }, { status: 201 });
  }
  return Response.json({ message: "The person was not logined" }, { status: 500 });
}

export {
  GET,
  POST
}