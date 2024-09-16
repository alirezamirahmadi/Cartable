import { Schema, models, model } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  }
})

const urgencyModel = models.urgency || model('urgency', schema);

export default urgencyModel;