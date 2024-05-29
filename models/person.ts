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
  }
})

const personModel = mongoose.model('person', schema);

export default personModel;