import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  showTitle: {
    type: String,
    required: true,
  },
  root: {
    type: mongoose.Types.ObjectId,
  },
  kind: {
    type: Number, // 1- Category, 2- Header, 3- Item
    required: true,
  }
})

const permissionModel = mongoose.models.permission || mongoose.model("permission", schema);

export default permissionModel;