import { cookies } from "next/headers";

import { verifyToken } from "@/utils/token";
import personModel from "@/models/person";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import path from "path";

import { hashPassword } from "@/utils/crypto";

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

  // const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account } = await request.json();

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
  const username = formData.get("username");
  const password = formData.get("password");

  // data check
  if ((typeof firstName === "string" && firstName?.trim().length < 2) ||
    (typeof lastName === "string" && lastName?.trim().length < 2) ||
    (typeof username === "string" && username?.trim().length < 4) ||
    (typeof password === "string" && password?.trim().length < 8)) {

    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  // hash password
  const hashedPassword = typeof password === "string" ? await hashPassword(password) : "";

  const imagePath = (typeof image !== "string" && image !== null) ? "/persons/images/" + Date.now() + image.name : ""
  const signPath = (typeof sign !== "string" && sign !== null) ? "/persons/signs/" + Date.now() + sign.name : "";

  const person = await personModel.findByIdAndUpdate(params.personId, { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, image:imagePath, sign:signPath, account: { username, password: hashedPassword } });

  if (person) {
    if (typeof image !== "string" && image !== null) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      image && await writeFile(path.join(process.cwd(), "/public" + imagePath), imageBuffer);
    }
    if (typeof sign !== "string" && sign !== null) {
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