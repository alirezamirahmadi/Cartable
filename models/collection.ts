import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  showTitle: {
    type: String,
    require: true,
  },
  route: {
    type: String,
  },
  numberRule: {
    type: String,
    require: true,
  },
  numberIdentity: {
    type: Number,
    require: true,
  },
  stepNumber: {
    type: Number,
    require: true,
  },
  isActive: {
    type: Boolean,
    require: true,
  }
})

const collectionModel = mongoose.models.collection || mongoose.model("collection", schema);

export default collectionModel;
