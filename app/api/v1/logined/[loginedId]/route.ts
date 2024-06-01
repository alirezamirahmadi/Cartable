import loginedModel from "@/models/logined";

const GET = async (request: Request, { params }: { params: { loginedId: string } }) => {
  const logined = await loginedModel.findById(params.loginedId);

  if (logined) {
    return Response.json(logined, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const DELETE = async (request: Request, { params }: { params: { loginedId: string } }) => {
  const logined = await loginedModel.findByIdAndDelete(params.loginedId);

  if (logined) {
    return Response.json({ message: "The person was logout" }, { status: 200 });
  }
  return Response.json({ message: "The person was not logout" }, { status: 500 });
}

export {
  GET,
  DELETE
}