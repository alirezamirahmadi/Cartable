import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refPerson: {
    type: String,
    require: true,
  },
  refRole: {
    type: String,
    require: true,
  },
  refCollection: {
    type: String,
    require: true,
  },
  refDocument: {
    type: String,
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
        type: String,
        require: true,
      },
      refRole: {
        type: String,
        require: true,
      },
      refUrgency: {
        type: String,
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