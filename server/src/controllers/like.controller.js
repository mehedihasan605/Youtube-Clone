import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new apiError(404, "video id invalid");
  }

  const likeDocument = await Like.findOne({
    video: videoId,
    likedBy: req?.user._id,
  });

  if (likeDocument) {
    await likeDocument.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "dislike successfully"));
  }

  await Like.create({
    video: videoId,
    likedBy: req?.user._id,
  });

  res.status(200).json(new apiResponse(200, null, "video like successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  if (!isValidObjectId(commentId)) {
    throw new apiError(404, "comment id invalid");
  }

  const likeDocument = await Like.findOne({
    comment: commentId,
    likedBy: req?.user._id,
  });

  if (likeDocument) {
    await likeDocument.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "dislike successfully"));
  }

  await Like.create({
    comment: commentId,
    likedBy: req?.user._id,
  });

  res.status(200).json(new apiResponse(200, null, "comment like successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.body;
  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "tweet id invalid");
  }

  const likeDocument = await Like.findOne({
    tweet: tweetId,
    likedBy: req?.user._id,
  });

  if (likeDocument) {
    await likeDocument.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "dislike successfully"));
  }

  await Like.create({
    tweet: tweetId,
    likedBy: req?.user._id,
  });

  res.status(200).json(new apiResponse(200, null, "tweet like successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const likeVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
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
        likedVideos: true,
      },
    },
    {
      $group: {
        _id: "$likedBy",
        videos: { $push: "$videos" },
        ownerDetails: { $first: "$ownerDetails" }, // ✅ ঠিকভাবে ধরে রাখছে
        likedVideos: { $first: "$likedVideos" },
        lastAt: { $max: "$createdAt" }, // ✅ ইউজারের সর্বশেষ লাইক টাইম
        totalViews: { $sum: "$videos.views" }, // ✅ Total views যোগ করছি
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
  console.log(likeVideos);
  res.status(200).json(new apiResponse(200, likeVideos[0], "like videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
