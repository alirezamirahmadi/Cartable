import { Schema, models, model } from "mongoose";
require("./permission");
require("./group");

const schema = new Schema({
  refPermission: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "permission",
  },
  refGroup: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "group",
  }
})

const groupPermissionModel = models.groupPermission || model("groupPermission", schema);

export default groupPermissionModel;