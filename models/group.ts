import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  root: {
    type: mongoose.Types.ObjectId,
  },
  kind: {
    type: Number, // 1- category 2- user group
    require: true,
  }
})

const groupModel = mongoose.models.group || mongoose.model("group", schema);

export default groupModel;