import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "cart",
    },
    sender: String,
    content: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("message", schema);

export default model;
