import { Schema, models, model } from "mongoose";
require("./person");

const schema = new Schema({
  refPerson: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "person",
  },
  ipAddress: {
    type: String,
    required: true,
  },
  loginDate: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  token: {
    type: String,
    required: true,
  }
})

const loggedModel = models.logged || model('logged', schema);

export default loggedModel;