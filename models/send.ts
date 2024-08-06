import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refPerson: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  refRole: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  refCollection: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  refDocument: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  sendDate: {
    type: Date,
    required: true,
  },
  parentReceive: {
    type: String,
  }
})

const sendModel = mongoose.models.send || mongoose.model('send', schema);

export default sendModel;