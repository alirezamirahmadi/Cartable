import { rm } from "fs/promises";
import path from "path";

import attachmentModel from "@/models/attachment";
import connectToDB from "@/utils/db";

const DELETE = async (request: Request, { params }: { params: { attachmentId: string } }) => {
  connectToDB();

  const attachment = await attachmentModel.findById(params.attachmentId);
  if (!attachment) {
    return Response.json({ message: "not found" }, { status: 404 });
  }

  const deletedAttachment = await attachmentModel.findByIdAndDelete(params.attachmentId);

  if (deletedAttachment) {
    await rm(path.join(process.cwd(), `/public${attachment.path}`));
    
    return Response.json({ message: "Attachment deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "Attachment was not delete" }, { status: 500 });
}

export {
  DELETE
}