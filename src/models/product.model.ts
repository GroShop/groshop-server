import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: String,
    price: Number,
    product_pic: String,
    tag: Array,
    categories: String,
    description: String,
    rating: Number,
    stock: Number,
    discount: Number,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("product", schema);

export default model;
