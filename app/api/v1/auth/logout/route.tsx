import { serialize } from "cookie";

import connectToDB from "@/utils/db";

const GET = () => {
  connectToDB();

  return Response.json({ message: "Person logged out successfully" }, {
    status: 200,
    headers: {
      "Set-Cookies": serialize("token", "", {
        path: "/",
        maxAge: 0,
      })
    }
  })
}

export {
  GET
}