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
    username: String,
    reset_password_hash: String,
    reset_password_expiry: Date,
    otp: String,
    otp_verify:Boolean,
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    profile_picture: String,
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("user", schema);

export default model;
