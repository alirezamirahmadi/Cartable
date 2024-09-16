import { Schema, models, model } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  showTitle: {
    type: String,
    required: true,
  },
  root: {
    type: Schema.Types.ObjectId,
    nullable: true,
  },
  kind: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1- Category, 2- Header, 3- Item
  }
})

const permissionModel = models.permission || model("permission", schema);

export default permissionModel;