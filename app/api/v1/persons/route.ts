import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import path from "path";

import { verifyToken } from "@/utils/token";
import { hashPassword } from "@/utils/crypto";
import personModel from "@/models/person";
import connectToDB from "@/utils/db";
import type { PersonType } from "@/types/personType";

const GET = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  let response: { json: any, status: number } = { json: null, status: 501 };
  let person;
  const { searchParams } = new URL(request.url);
  let username = searchParams.get("username");
  let password = searchParams.get("password");
  let limited = searchParams.get("limited");

  if (searchParams.size === 0) {
    person = await personModel.find();
  }
  else if (limited === "true") {
    person = await personModel.aggregate()
      .match({ isActive: true })
      .project({ "code": 1, "firstName": 1, "lastName": 1, "gender": 1, "phone": 1, "image": 1, "sign": 1 })
  }
  else if (username && password) {
    person = await personModel.find({ account: { username, password, isActive: true } }).exec();
  }

  response = person ? { json: person, status: 200 } : { json: { message: "Persons not found" }, status: 404 };
  return Response.json(response.json, { status: response.status });
}

const POST = async (request: Request) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  // const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account }: PersonType = await request.json();
  const formData = await request.formData();
  const code = formData.get("code");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const nationalCode = formData.get("nationalCode");
  const birthday = formData.get("birthday");
  const gender = formData.get("gender");
  const maritalStatus = formData.get("maritalStatus");
  const education = formData.get("education");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const address = formData.get("address");
  const description = formData.get("description");
  const isActive = formData.get("isActive");
  const image = formData.get("image");
  const sign = formData.get("sign");
  const account = formData.get("account");

  // data check
  if (firstName?.trim().length < 2 || lastName?.trim().length < 2 || account?.username?.trim().length < 4 || account?.password?.trim().length < 8) {
    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  // username exist
  const personExist = await personModel.findOne({ "account.username": account?.username });
  if (personExist) {
    return Response.json({ message: "Username already exists" }, { status: 422 });
  }

  // hash password
  const hashedPassword = await hashPassword(account.password);

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const signBuffer = Buffer.from(await sign.arrayBuffer());
  const imageFileName = new Date() + image.name;
  const signFileName = new Date() + sign.name;

  const person = await personModel.create({ code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, image: imageFileName, sign: signFileName, account: { ...account, password: hashedPassword } });

  if (person) {
    await writeFile(path.join(process.cwd(), "/public/persons/images/" + imageFileName), imageBuffer);
    await writeFile(path.join(process.cwd(), "/public/persons/signs/" + signFileName), signBuffer);

    return Response.json({ message: "Person created successfully" }, { status: 201 });
  }
  return Response.json({ message: "Person is not created" }, { status: 500 });
}

export {
  GET,
  POST
}