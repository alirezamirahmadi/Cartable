import mongoose from "mongoose";
require("./person");
require("./collection");
require("./document");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  path: {
    type: String,
    required: true,
  },
  refPerson: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "person",
  },
  refCollection: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "collection",
  },
  refDocument: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "document",
  },
})

const attachmentModel = mongoose.models.attachment || mongoose.model("attachment", schema);

export default attachmentModel;