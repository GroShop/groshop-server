import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    amount: Number,
    status: String,
    payment_type: String,
    voucher: {
      type: mongoose.Types.ObjectId,
      ref: "voucher",
    },
    delivery_time: Date,
    cart: 
      {
        type: mongoose.Types.ObjectId,
        ref: "cart",
      },
    
    address: {
      name: String,
      place: String,
      phone_number: String,
      address: String,
      default_address: Boolean,
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay: Object,
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    tracking_status: [{
      status:String,
      created_at: Date,
    }],
    cancel_reason: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("booking", schema);

export default model;
