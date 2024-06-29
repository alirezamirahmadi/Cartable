import { cookies } from "next/headers";

import personModel from "@/models/person";
import { verifyToken } from "@/utils/token";
import { hashPassword } from "@/utils/crypto";
import connectToDB from "@/utils/db";


const GET = () => {
  return Response.json({ message: "ok" })
}

const PUT = async (request: Request) => {
  connectToDB();
  
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const { oldPassword, newPassword } = await request.json();
  const tokenPayload = verifyToken(token ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 })
  }

  if (typeof tokenPayload !== "string") {

    const isOldPasswordValid = personModel.findOne({ "account.username": tokenPayload.username, "account.password": await hashPassword(oldPassword) });
    if (!isOldPasswordValid) {
      return Response.json({ message: "Old password is incorrect" }, { status: 401 })
    }

    const person = await personModel.findOneAndUpdate({ "account.username": tokenPayload.username }, {
      $set: { "account.password": await hashPassword(newPassword) }
    })
    if (person) {
      return Response.json({ message: "Password updated successfully" }, { status: 201 })
    }
  }
}

export {
  GET,
  PUT
}