import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { zfd } from "zod-form-data";

import connectToDB from "@/utils/db";
import attachmentModel from "@/models/attachment";
import collectionModel from "@/models/collection";

const formDataSchema = zfd.formData({
  file: zfd.file(),
  description: zfd.text(),
  refCollection: zfd.text(),
  refDocument: zfd.text(),
})

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

  const { file, description, refCollection, refDocument, } = formDataSchema.parse(await request.formData());

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

  const filePath = `/attachment/${collection[0].title}/${year}/${month}/${Date.now()}${file.name}`;
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

  const attachment = await attachmentModel.create({ title: file.name, description, path: filePath, refPerson: "66b1c26a4af25da311437999", refCollection, refDocument })

  if (attachment) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    file && await writeFile(path.join(process.cwd(), `/public${filePath}`), fileBuffer);

    return Response.json({ message: "File attached successfully" }, { status: 201 });
  }
  return Response.json({ message: "File is not attach" }, { status: 500 });
}

export {
  GET,
  POST
}