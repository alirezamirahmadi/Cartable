import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  refPerson: {
    type: mongoose.Schema.ObjectId,
  },
  root: {
    type: mongoose.Schema.ObjectId,
    null: true,
  },
  isDefault: {
    type: Boolean
  },
  isActive: {
    type: Boolean,
    required: true,
  }
})

const roleModel = mongoose.models.role || mongoose.model('role', schema);

export default roleModel;