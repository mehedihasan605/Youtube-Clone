import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Watchlater } from "../models/watchlater.model.js";

const getWatchlaterVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { sort } = req.query;
  

  let sortCondition = {};

  if (sort === "newest") {
    sortCondition = { createdAt: -1 };
  } else {
    sortCondition = { createdAt: 1 };
  }

  const getAllVideos = await Watchlater.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      // ধাপ ২: গ্রুপ করার আগেই ডকুমেন্টগুলোকে তারিখ অনুযায়ী সাজিয়ে নিন
      // এটিই মূল পরিবর্তন এবং সবচেয়ে গুরুত্বপূর্ণ ধাপ
      $sort: sortCondition,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              userName: 1,
            },
          },
        ],
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
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
                  },
                },
              ],
              as: "videoOwner",
            },
          },
          {
            $unwind: "$videoOwner",
          },
        ],
        as: "videos",
      },
    },
    {
      $unwind: "$videos",
    },
    {
      $addFields: {
        likedVideos: false,
        watchId: "$_id",
      },
    },
    {
      $group: {
        _id: "$owner",
        videos: {
          $push: {
            $mergeObjects: ["$videos", { watchId: "$watchId" }],
          },
        },
        ownerDetails: { $first: "$ownerDetails" },
        likedVideos: { $first: "$likedVideos" },
        lastAt: { $max: "$createdAt" },
        totalViews: { $sum: "$videos.views" },
      },
    },
    {
      $project: {
        _id: 0,
        videos: 1,
        ownerDetails: 1,
        likedVideos: 1,
        lastAt: 1,
        totalViews: 1, // ✅ Output এ পাঠাচ্ছি
      },
    },
  ]);

  if (!getAllVideos) {
    return res

      .status(200)

      .json(new apiResponse(200, "watchLater Videos Not Found"));
  }

  

  res

    .status(200)

    .json(new apiResponse(200, getAllVideos[0], "your watch later videos"));
});

const watchlaterVideoAdd = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid video ID");
  }

  const video = await Watchlater.findOne({ video: videoId, owner: userId });

  if (video) {
    return res
      .status(200)
      .json(new apiResponse(400, {}, "Video already exists in WatchLater"));
  }

  await Watchlater.create({
    owner: userId,
    video: videoId,
  });

  res.status(200).json(new apiResponse(200, {}, "Video in WatchLater"));
});

const watchlaterVideoRemove = asyncHandler(async (req, res) => {
  const { watchlaterId } = req.params;

  if (!isValidObjectId(watchlaterId)) {
    throw new apiError(400, "Invalid video ID");
  }

  await Watchlater.findByIdAndDelete(watchlaterId);

  res
    .status(200)
    .json(new apiResponse(200, {}, "Video Removed From WatchLater"));
});

export { getWatchlaterVideos, watchlaterVideoAdd, watchlaterVideoRemove };
