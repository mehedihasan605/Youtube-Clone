import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req?.user._id;

  if (!userId) {
    throw new apiError(401, "Unauthorized request");
  }

  const totalSubscriber = await Subscription.countDocuments({
    channel: userId,
  });

  const videoStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const likesStats = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $match: {
        "videoDetails.owner": new mongoose.Types.ObjectId(userId),
      },
    },

    {
      $count: "totalLikes",
    },
  ]);

  const totalVideos = videoStats[0]?.totalVideos || 0;
  const totalViews = videoStats[0]?.totalViews || 0;
  const totalLikes = likesStats[0]?.totalLikes || 0;

  res.status(200).json(
    new apiResponse(
      200,
      {
        totalSubscriber,
        totalVideos,
        totalViews,
        totalLikes,
      },
      "dashboard stats"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { query } = req.query;

  if (!isValidObjectId(userId)) {
    throw new apiError(400, "invalid id");
  }

  const queryObj = {};

  if (query) {
    queryObj.title = { $regex: query, $options: "i" };
  }

  const getVideos = await Video.find({ owner: userId, ...queryObj });

  if (!getVideos) {
    return res.status(200).json(apiResponse(200, "no video found"));
  }

  res
    .status(200)
    .json(new apiResponse(200, getVideos, "all video fetch successfully"));
});

export { getChannelStats, getChannelVideos };
