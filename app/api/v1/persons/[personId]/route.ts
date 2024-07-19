import personModel from "@/models/person";
import connectToDB from "@/utils/db";
import mongoose from "mongoose";

import { hashPassword } from "@/utils/crypto";

const GET = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();

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

  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account } = await request.json();

  // data check
  if (firstName?.trim().length < 2 || lastName?.trim().length < 2 || account?.username?.trim().length < 4 || account?.password?.trim().length < 8) {
    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  // hash password
  const hashedPassword = await hashPassword(account.password);

  const person = await personModel.findByIdAndUpdate(params.personId, { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account: { ...account, password: hashedPassword } });

  if (person) {
    return Response.json({ message: "Person updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "Person was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();

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