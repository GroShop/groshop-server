import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    cart_product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    status: String,
    weight: Number,
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("cart", schema);

export default model;
