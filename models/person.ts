import { Schema, model, models } from "mongoose";

const schema = new Schema({
  code: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
    minLength: 2,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
  },
  nationalCode: {
    type: String,
    length: 10,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: Number,
    enum: [1, 2], // 1-man, 2-woman
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
    match: /(\w+[\.-]?\w+)@\w+([\.-]?\w+)*(\.\w{2,3})/,
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
    required: true,
  },
  avatar: {
    type: String,
  },
  sign: {
    type: String,
  },
  account: {
    username: { type: String, required: true, minLength: 4 },
    password: { type: String, required: true, minLength: 8 },
  }
},
  {
    toJSON: { virtuals: true },
    virtuals: {
      fullName: {
        get() { return this.firstName + " " + this.lastName; }
      }
    }
  }
)

const personModel = models.person || model('person', schema);

export default personModel;