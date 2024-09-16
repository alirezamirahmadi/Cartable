import {Schema, models, model} from "mongoose";
require("./person");
require("./collection");

const schema = new Schema({
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
    type: Schema.Types.ObjectId,
    required: true,
    ref: "person",
  },
  refCollection: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "collection",
  },
  refDocument: {
    type: Schema.Types.ObjectId,
    required: true,
  },
})

const attachmentModel = models.attachment || model("attachment", schema);

export default attachmentModel;