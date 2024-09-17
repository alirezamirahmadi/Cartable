import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { verifyToken } from "@/utils/token";
import { hashPassword } from "@/utils/crypto";
import personModel from "@/models/person";
import connectToDB from "@/utils/db";

const formDataSchema = zfd.formData({
  code: zfd.text(z.string().optional()),
  firstName: zfd.text(),
  lastName: zfd.text(),
  nationalCode: zfd.text(z.string().optional()),
  birthday: zfd.text(z.string().optional()),
  gender: zfd.text(z.string().optional()),
  maritalStatus: zfd.text(z.string().optional()),
  education: zfd.text(z.string().optional()),
  phone: zfd.text(z.string().optional()),
  email: zfd.text(z.string().optional()),
  address: zfd.text(z.string().optional()),
  description: zfd.text(z.string().optional()),
  isActive: zfd.text(z.string().optional()),
  avatar: zfd.file(z.instanceof(File).optional()).or(zfd.text(z.string().optional())),
  sign: zfd.file(z.instanceof(File).optional()).or(zfd.text(z.string().optional())),
  username: zfd.text(),
  password: zfd.text(),
})

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
      .project({ "code": 1, "firstName": 1, "lastName": 1, "gender": 1, "phone": 1, "avatar": 1, "sign": 1 })
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

  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, avatar, sign, username, password } = formDataSchema.parse(await request.formData());

  // data check
  if (firstName?.trim().length < 2 || lastName?.trim().length < 2 || username?.trim().length < 4 || password?.trim().length < 8) {
    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  // username exist
  const personExist = await personModel.findOne({ "account.username": username });
  if (personExist) {
    return Response.json({ message: "Username already exists" }, { status: 422 });
  }

  // hash password
  const hashedPassword = await hashPassword(password);

  const avatarPath = (typeof avatar !== "string" && avatar) ? "/persons/avatars/" + Date.now() + avatar.name : ""
  const signPath = (typeof sign !== "string" && sign) ? "/persons/signs/" + Date.now() + sign.name : "";

  const person = await personModel.create({ code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, avatar: avatarPath, sign: signPath, account: { username, password: hashedPassword } });

  if (person) {
    if (typeof avatar !== "string" && avatar) {
      const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
      await writeFile(path.join(process.cwd(), "/public" + avatarPath), avatarBuffer);
    }
    if (typeof sign !== "string" && sign) {
      const signBuffer = Buffer.from(await sign.arrayBuffer());
      await writeFile(path.join(process.cwd(), "/public" + signPath), signBuffer);
    }

    return Response.json({ message: "Person created successfully" }, { status: 201 });
  }
  return Response.json({ message: "Person is not created" }, { status: 500 });
}

export {
  GET,
  POST
}