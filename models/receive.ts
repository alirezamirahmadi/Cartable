import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refSend: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  refPerson: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  refRole: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  refUrgency: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  viewDate: {
    type: Date,
  },
  lastViewedDate: {
    type: Date,
  },
  comment: {
    type: String,
  },
  observed: {
    type: Boolean,
    require: true,
  }
})

const receiveModel = mongoose.models.receive || mongoose.model("receive", schema);

export default receiveModel;