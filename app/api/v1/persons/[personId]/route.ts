import personModel from "@/models/person";
import connectToDB from "@/utils/db";

const GET = async (request: Request, { params }: { params: { personId: string } }) => {
connectToDB();

const person = await personModel.findById(params.personId).exec();

if (person) {
  return Response.json(person, { status: 200 });
}
return Response.json({ message: "Person not found" }, { status: 404 });
}

const PUT = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();
  
  const { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account, refRole } = await request.json();
  
  const person = await personModel.findByIdAndUpdate(params.personId, { code, firstName, lastName, nationalCode, birthday, gender, maritalStatus, education, phone, email, address, description, isActive, account, refRole });
  
  if (person) {
    return Response.json({ message: "The Person was updated successfully" }, { status: 201 });
  }
  return Response.json({ message: "The person was not updated" }, { status: 500 });
}

const DELETE = async (request: Request, { params }: { params: { personId: string } }) => {
  connectToDB();

  const person = await personModel.findByIdAndDelete(params.personId);

  if (person) {
    return Response.json({ message: "Person deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "The person was not deleted" }, { status: 500 });
}

export {
  GET,
  PUT,
  DELETE
}