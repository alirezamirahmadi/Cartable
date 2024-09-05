import mongoose from "mongoose";
require("./person");
require("./collection");

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
  createDate: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
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
  },
})

const attachmentModel = mongoose.models.attachment || mongoose.model("attachment", schema);

export default attachmentModel;