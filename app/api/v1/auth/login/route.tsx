import personModel from "@/models/person";
import connectToDB from "@/utils/db";
import type { LoginType } from "@/types/AuthType";
import { verifyPassword } from "@/utils/crypto";
import { createToken } from "@/utils/token";
import { serialize } from "cookie";

const POST = async (request: Request) => {
  connectToDB();

  const { username, password }: LoginType = await request.json();

  if (username?.trim().length < 4 || password?.trim().length < 8) {
    return Response.json({ message: "Data is invalid" }, { status: 422 });
  }

  const person = await personModel.findOne({ "account.username": username });
  if (!person) {
    return Response.json({ message: "The username or password is incorrect" }, { status: 404 });
  }

  const isPasswordValid = await verifyPassword(password, person.account.password);
  if (!isPasswordValid) {
    return Response.json({ message: "The username or password is incorrect" }, { status: 404 });
  }

  const token = createToken({ username });
  return Response.json(person, {
    status: 200,
    headers: {
      "Set-Cookies": serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24
      })
    }
  })
}

export {
  POST
}