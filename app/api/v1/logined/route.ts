import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import loggedModel from "@/models/logged";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();
  
  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  let response: { json: any, status: number } = { json: null, status: 501 };
  const { searchParams } = new URL(request.url);
  let login;

  if (searchParams.size === 0) {
    login = await loggedModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" });
  }
  else {
    let token = searchParams.get('token');
    login = await loggedModel.aggregate()
      .match({ token })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" });
  }

  response = login ? { json: login, status: 200 } : { json: { message: "not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}

const POST = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { refPerson, ipAddress, loginDate, token } = await request.json();

  const logined = await loggedModel.create({ refPerson, ipAddress, loginDate, token });

  if (logined) {
    return Response.json({ message: "Person logged in successfully" }, { status: 201 });
  }
  return Response.json({ message: "The person is not logged in" }, { status: 500 });
}

export {
  GET,
  POST
}