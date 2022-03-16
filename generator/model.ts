// @ts-nocheck
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    _MO_,
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("_MN_", schema);

export default model;
