import { cookies } from "next/headers";
import { writeFile, rm } from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import {z} from "zod";
import { zfd } from "zod-form-data";

import { verifyToken } from "@/utils/token";
import personModel from "@/models/person";
import connectToDB from "@/utils/db";

import { hashPassword } from "@/utils/crypto";

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
  password: zfd.text(z.string().optional()),
})

const GET = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const person = await personModel.aggregate()
    .match({ _id: { $eq: new mongoose.Types.ObjectId(params.personId) } })
    .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "roles" });

  if (person) {
    return Response.json(person, { status: 200 });
  }
  return Response.json({ message: "Person not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, avatar, sign, username, password } = formDataSchema.parse(await request.formData());

  // data check
  if (firstName?.trim().length < 2 || lastName?.trim().length < 2 || username?.trim().length < 4 ||(password && password?.trim().length < 8)) {
    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  // hash password
  // const hashedPassword = password ? await hashPassword(password) : "";
  const account = password ? { username, password: await hashPassword(password) } : { username };

  // delete old avatar and sign
  const selectedPerson = await personModel.findById(params.personId);
  if (avatar && selectedPerson && selectedPerson.avatar) {
    await rm(path.join(process.cwd(), `/public${selectedPerson.avatar}`));
  }
  if (sign && selectedPerson && selectedPerson.sign) {
    await rm(path.join(process.cwd(), `/public${selectedPerson.sign}`));
  }


  // set avatar and sign path
  let avatarPath = (typeof avatar !== "string" && avatar) ? "/persons/avatars/" + Date.now() + avatar.name : selectedPerson.avatar
  avatar === "Delete" ? avatarPath = "" : "";

  let signPath = (typeof sign !== "string" && sign) ? "/persons/signs/" + Date.now() + sign.name : selectedPerson.sign;
  sign === "Delete" ? signPath = "" : "";


  const person = await personModel.findByIdAndUpdate(params.personId, { $set: { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, avatar: avatarPath, sign: signPath, account } });

  if (person) {
    if (typeof avatar !== "string" && avatar) {
      const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
      avatar && await writeFile(path.join(process.cwd(), "/public" + avatarPath), avatarBuffer);
    }
    if (typeof sign !== "string" && sign) {
      const signBuffer = Buffer.from(await sign.arrayBuffer());
      sign && await writeFile(path.join(process.cwd(), "/public" + signPath), signBuffer);
    }

    return Response.json({ message: "Person updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Person was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();

  if (!verifyToken(cookies().get("token")?.value ?? "")) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  const personUsed = await personModel.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(params.personId) })
    .lookup({ from: "roles", localField: "_id", foreignField: "refPerson", as: "roles" })
    .lookup({ from: "sends", localField: "_id", foreignField: "refPerson", as: "sends" })
    .lookup({ from: "receives", localField: "_id", foreignField: "refPerson", as: "receives" })

  if (personUsed[0].roles.length > 0 || personUsed[0].sends.length > 0 || personUsed[0].receives.length > 0) {
    return Response.json({ message: "This Person used in roles/send/receive" }, { status: 403 })
  }

  if (personUsed[0].avatar) {
    await rm(path.join(process.cwd(), `/public${personUsed[0].avatar}`));
  }
  if (personUsed[0].sign) {
    await rm(path.join(process.cwd(), `/public${personUsed[0].sign}`));
  }

  const person = await personModel.findByIdAndDelete(params.personId);

  if (person) {
    return Response.json({ message: "Person deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Person was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}