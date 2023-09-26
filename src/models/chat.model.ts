import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    isAdmin: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    groupChat: Boolean,
    groupChaName: String,
    lastMessage:{
      type: mongoose.Types.ObjectId,
      ref: "message",
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("chat", schema);

export default model;
