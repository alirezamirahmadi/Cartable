import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refSend: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  refPerson: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  refRole: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  refUrgency: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  viewDate: {
    type: Date,
    null: true,
  },
  lastViewedDate: {
    type: Date,
    null: true,
  },
  comment: {
    type: String,
  },
  observed: {
    type: Boolean,
    required: true,
  }
})

const receiveModel = mongoose.models.receive || mongoose.model("receive", schema);

export default receiveModel;