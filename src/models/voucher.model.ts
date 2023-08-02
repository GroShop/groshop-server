
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
      name: String,
  discount: Number,
  expire_voucher: Date,
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("voucher", schema);

export default model;
