import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

import connectToDB from "@/utils/db";
import attachmentModel from "@/models/attachment";
import collectionModel from "@/models/collection";

const GET = async (request: Request) => {
  connectToDB();

  const { searchParams } = new URL(request.url);
  const refCollection = searchParams.get("refCollection");
  const refDocument = searchParams.get("refDocument");

  const attachment = await attachmentModel.aggregate()
    .match({
      refCollection: new mongoose.Types.ObjectId(refCollection ?? ""),
      refDocument: new mongoose.Types.ObjectId(refDocument ?? "")
    })
    .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
    .project({ "title": 1, "description": 1, "path": 1, "createDate": 1, "person.firstName": 1, "person.lastName": 1 })
    .unwind("person")

  if (attachment) {
    return Response.json(attachment, { status: 200 });
  }
  return Response.json({ message: "not found" }, { status: 404 });
}

const POST = async (request: Request) => {
  connectToDB();

  const formData = await request.formData();
  const file = formData.get("file");
  const description = formData.get("description");
  const refCollection = formData.get("refCollection");
  const refDocument = formData.get("refDocument");

  if (!file) {
    return Response.json({ message: "File is required" }, { status: 403 });
  }

  const collection = await collectionModel.find({ _id: refCollection });
  if (!collection) {
    return Response.json({ message: "Collection is invalid" }, { status: 403 });
  }

  const date = new Date(Date.now());
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const filePath = (typeof file !== "string" && file !== null) ? `/attachment/${collection[0].title}/${year}/${month}/${Date.now()}${file.name}` : ""
  const writePath = path.join(process.cwd(), `/public/attachment/${collection[0].title}`);

  if (!existsSync(writePath)) {
    mkdirSync(writePath);
  }
  if (!existsSync(`${writePath}/${year}`)) {
    mkdirSync(`${writePath}/${year}`);
  }
  if (!existsSync(`${writePath}/${year}/${month}`)) {
    mkdirSync(`${writePath}/${year}/${month}`);
  }

  const attachment = await attachmentModel.create({ title: (typeof file !== "string" && file !== null) ? file.name : "", description, path: filePath, refPerson: "66b1c26a4af25da311437999", refCollection, refDocument })

  if (attachment) {
    if (typeof file !== "string" && file !== null) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      file && await writeFile(path.join(process.cwd(), `/public${filePath}`), fileBuffer);
    }
    return Response.json({ message: "File attached successfully" }, { status: 201 });
  }
  return Response.json({ message: "File is not attach" }, { status: 500 });
}

export {
  GET,
  POST
}