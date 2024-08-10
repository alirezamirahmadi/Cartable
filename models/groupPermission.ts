import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refPermission: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  refGroup: {
    type: mongoose.Types.ObjectId,
    required: true,
  }
})

const groupPermissionModel = mongoose.models.groupPermission || mongoose.model("groupPermission", schema);

export default groupPermissionModel;