import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Watched } from "../models/watched.model.js";

const getWatchedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const getAllVideos = await Watched.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },

    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
              as: "ownerDetails",
            },
          },
          {
            $unwind: "$ownerDetails",
          },
        ],
        as: "videos",
      },
    },
    {
      $unwind: "$videos",
    },
  ]);


  if (!getAllVideos) {
    return res
      .status(200)
      .json(new apiResponse(200, "watched Videos Not Found"));
  }

  res
    .status(200)
    .json(new apiResponse(200, getAllVideos, "your watched videos"));
});

const watchedVideoAdd = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }

  const isExits = await Watched.findOne({
    owner: userId,
    video: videoId,
  });

  if (isExits) {
    return res
      .status(200)
      .json(new apiResponse(200, null, "video already in watch History"));
  }

  await Watched.create({
    owner: userId,
    video: videoId,
  });

  res.status(200).json(new apiResponse(200, {}, "Video in History"));
});

const watchedVideoRemove = asyncHandler(async (req, res) => {
  const { historyId } = req.params;

  if (!isValidObjectId(historyId)) {
    throw new apiError(400, "Invalid video ID");
  }

  await Watched.findByIdAndDelete(historyId);

  res
    .status(200)
    .json(new apiResponse(200, {}, "Video Removed From WatchLater"));
});

export { getWatchedVideos, watchedVideoAdd, watchedVideoRemove };
