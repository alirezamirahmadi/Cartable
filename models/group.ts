import { Schema, models, model } from "mongoose";

const schema = new Schema({
  title: {
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
    enum: [1, 2], // 1- category, 2- user group
  },
  permissions: {
    type: [Schema.Types.ObjectId],
  }
})

const groupModel = models.group || model("group", schema);

export default groupModel;