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
  route: {
    type: String,
  },
  numberRule: {
    type: String,
    required: true,
  },
  numberIdentity: {
    type: Number,
    required: true,
  },
  stepNumber: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  }
})

const collectionModel = models.collection || model("collection", schema);

export default collectionModel;
