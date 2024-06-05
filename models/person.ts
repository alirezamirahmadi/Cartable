import mongoose from "mongoose";

const schema = new mongoose.Schema({
  code: {
    type: String,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  nationalCode: {
    type: String,
    length: 10,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: Boolean,
  },
  maritalStatus: {
    type: Boolean,
  },
  education: {
    type: String,
  },
  phone: {
    type: String,
    maxLength: 11,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
    maxLength: 500,
  },
  isActive: {
    type: Boolean,
    require: true,
  },
  account: {
    username: { type: String, require: true, minLength: 4 },
    password: { type: String, require: true, minLength: 8, maxLength: 20 },
    isActive: { type: Boolean, require: true }
  },
  refRole: [mongoose.Schema.ObjectId]
})

const personModel = mongoose.models.person || mongoose.model('person', schema);

export default personModel;