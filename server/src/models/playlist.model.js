import mongoose from "mongoose";

const playListSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    video: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPublished: {
      type: String,
      required: true,
    },
    playlistImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const PlayList = mongoose.model("PlayList", playListSchema);
