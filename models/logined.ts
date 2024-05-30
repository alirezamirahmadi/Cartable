import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refPerson: {
    type: String,
    require: true,
  },
  ipAddress: {
    type: String,
    require: true,
  },
  loginDate: {
    type: Date,
    require: true,
  }
})

const loginedModel = mongoose.model('logined', schema);

export default loginedModel;