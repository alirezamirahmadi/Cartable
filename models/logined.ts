import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refPerson: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  ipAddress: {
    type: String,
    require: true,
  },
  loginDate: {
    type: Date,
    require: true,
  },
  token: {
    type: String,
    require: true,
  }
})

const loginedModel = mongoose.models.logined || mongoose.model('logined', schema);

export default loginedModel;