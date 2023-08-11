import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    email: String,
    password: String,
    role: String,
    confirmed: Boolean,
    social_account_type: String,  
    email_confirmation_id: String,
    email_verified: Boolean,
    username: String,
    otp: String,
    otp_verify:Boolean,
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    profile_pic: String,
    phone_num: String,
    address:[{
      name:String,
      place: String,
      phone_number: String,
      address: String,
      default_address:Boolean,
    }],
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("user", schema);

export default model;
