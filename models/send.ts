import { Schema, models, model } from "mongoose";

const schema = new Schema({
  refPerson: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  refRole: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  refCollection: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  refDocument: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  sendDate: {
    type: Date,
    required: true,
    default: () => Date.now(),
    immutable: false,
  },
  parentReceive: {
    type: String,
  }
})

const sendModel = models.send || model('send', schema);

export default sendModel;