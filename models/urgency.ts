import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  }
})

const urgencyModel = mongoose.models.urgency || mongoose.model('urgency', schema);

export default urgencyModel;