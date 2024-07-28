import mongoose from "mongoose";

const schema = new mongoose.Schema({
  refGroup: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  refRole: {
    type: mongoose.Types.ObjectId,
    required: true,
  }
})

const groupMemberModel = mongoose.models.groupMember || mongoose.model("groupMember", schema);

export default groupMemberModel;