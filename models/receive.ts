import { Schema, models, model } from "mongoose";
require("./send");
require("./person");
require("./role");
require("./urgency");

const schema = new Schema({
  refSend: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "send",
  },
  refPerson: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "person",
  },
  refRole: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "role",
  },
  refUrgency: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "urgency",
  },
  viewDate: {
    type: Date,
    nullable: true,
  },
  lastViewedDate: {
    type: Date,
    nullable: true,
  },
  comment: {
    type: String,
  },
  observed: {
    type: Boolean,
    required: true,
  }
})

const receiveModel = models.receive || model("receive", schema);

export default receiveModel;