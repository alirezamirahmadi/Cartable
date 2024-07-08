import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refPerson: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  refRole: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  refCollection: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  refDocument: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  ipAddress: {
    type: String,
  },
  sendDate: {
    type: Date,
    require: true,
  },
  parentReceive: {
    type: String,
    require: true,
  }
})

const sendModel = mongoose.models.send || mongoose.model('send', schema);

export default sendModel;