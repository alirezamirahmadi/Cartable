import { hashPassword } from "@/utils/crypto";
import personModel from "@/models/person";
import connectToDB from "@/utils/db";
import type { PersonType } from "@/types/personType";

const GET = async (request: Request) => {
  connectToDB();

  let response: { json: any, status: number } = { json: null, status: 501 };
  let person;
  const { searchParams } = new URL(request.url);

  if (searchParams.size === 0) {
    person = await personModel.aggregate()
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" });
  }
  else {
    let username = searchParams.get("username");
    let password = searchParams.get("password");
    // person = await personModel.find({ account: { username, password, isActive: true } }).exec();
    person = await personModel.aggregate()
      .match({ account: { username, password, isActive: true } })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" });
  }

  response = person ? { json: person, status: 200 } : { json: { message: "Persons not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}

const POST = async (request: Request) => {

  connectToDB();

  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account }: PersonType = await request.json();

  // data check
  if (firstName?.trim().length < 2 || lastName?.trim().length < 2 || account?.username?.trim().length < 4 || account?.password?.trim().length < 8) {
    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  // username exist
  const personExist = await personModel.findOne({ "account.username": account.username });
  if (personExist) {
    return Response.json({ message: "Username already exists" }, { status: 422 });
  }

  // hash password
  const hashedPassword = await hashPassword(account.password);

  const person = await personModel.create({ code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account: { ...account, password: hashedPassword } });

  if (person) {
    return Response.json({ message: "Person created successfully" }, {status: 201});
  }
  return Response.json({ message: "Person is not created" }, { status: 500 });
}

export {
  GET,
  POST
}