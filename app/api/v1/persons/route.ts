import personModel from "@/models/person";

const GET = async () => {
  const persons = await personModel.find();

  if (persons) {
    return Response.json(persons, { status: 200 });
  }
  return Response.json({ message: "Persons not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account, refRole } = await request.json();

  const person = await personModel.create({ code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account, refRole });

  if (person) {
    return Response.json({ message: "The person was successfully created" }, { status: 201 });
  }
  return Response.json({ message: "The person was not created" }, { status: 500 });
}

export {
  GET,
  POST
}