import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    wishlist_product: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
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
const model = mongoose.model("wishlist", schema);

export default model;
