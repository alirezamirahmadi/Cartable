import { Schema, models, model } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  refPerson: {
    type: Schema.Types.ObjectId,
  },
  root: {
    type: Schema.Types.ObjectId,
    nullable: true,
  },
  isDefault: {
    type: Boolean
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  permissions: {
    type: [Schema.Types.ObjectId],
  }
})

const roleModel = models.role || model('role', schema);

export default roleModel;