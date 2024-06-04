import personModel from "@/models/person";
import connectToDB from "@/utils/db";

const GET = async (request: Request) => {
  connectToDB();

  let response: { json: any, status: number } = { json: null, status: 501 };
  let person;
  const { searchParams } = new URL(request.url);

  if (searchParams.size === 0) {
    person = await personModel.find();
  }
  else {
    let username = searchParams.get("username");
    let password = searchParams.get("password");
    person = await personModel.find({ account:{username, password, isActive:true} }).exec();
  }

  response = person ? { json: person, status: 200 } : { json: { message: "Persons not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}

const POST = async (request: Request) => {
  connectToDB();
  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account, refRole } = await request.json();

  const person = await personModel.create({ code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account, refRole });

  if (person) {
    return Response.json({ message: "The person was created successfully" }, { status: 201 });
  }
  return Response.json({ message: "The person was not created" }, { status: 500 });
}

export {
  GET,
  POST
}