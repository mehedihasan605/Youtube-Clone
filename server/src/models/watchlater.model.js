import mongoose from "mongoose";

const watchlaterSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

export const Watchlater = mongoose.model("Watchlater", watchlaterSchema);
