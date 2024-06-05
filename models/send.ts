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
  receivers: [
    {
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
    }
  ]
})

const sendModel = mongoose.models.send || mongoose.model('send', schema);

export default sendModel;