import { cookies } from "next/headers";
import personModel from "@/models/person";
import { verifyToken } from "@/utils/token";

const GET = async () => {
  const cookieStore = cookies();
  const tokenPayload = verifyToken(cookieStore.get("token")?.value ?? "");

  if (!tokenPayload) {
    return Response.json({ message: "Person is not login" }, { status: 401 });
  }

  if (typeof tokenPayload !== "string") {
    const person = await personModel.findOne({ "account.username": tokenPayload.username });
    return person && Response.json(person, { status: 200 });
  }

  return Response.json({ message: "not found" }, { status: 404 });
}

export {
  GET
}