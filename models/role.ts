import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  refPerson: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  root: {
    type: String,
    require: true,
  },
  isActive: {
    type: Boolean,
    require: true,
  }
})

const roleModel = mongoose.models.role || mongoose.model('role', schema);

export default roleModel;