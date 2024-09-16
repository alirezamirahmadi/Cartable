import { Schema, models, model } from "mongoose";
require("./group");
require("./role");

const schema = new Schema({
  refGroup: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "group",
  },
  refRole: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "role",
  }
})

const groupMemberModel = models.groupMember || model("groupMember", schema);

export default groupMemberModel;