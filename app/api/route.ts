import connectToDB from "@/utils/db";

export function GET() {
  connectToDB();
  return Response.json({ message: "AnnaLena welcome to mongodb :))" });
}