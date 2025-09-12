import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req?.user._id;

  // Validate user ID
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid user ID");
  }

  // Validate content - at least content or image should be provided
  if (!content || content.trim() === "") {
    if (!req.file) {
      throw new apiError(400, "Tweet must contain either content or an image");
    }
  }
 
  let imageUrl = null;
  let tweetImageLocalPath;

  // Handle image upload if file is provided
  if (req.file) {
    tweetImageLocalPath = req.file.path;

    try {
      const imageFile = await uploadFileOnCloudinary(tweetImageLocalPath);

      if (!imageFile?.url) {
        throw new apiError(500, "Failed to upload image to cloudinary");
      }

      imageUrl = imageFile.url;
    } catch (error) {
      throw error;
    }
  }

  // Create tweet
  const newTweet = await Tweet.create({
    content: content?.trim() || "",
    tweetImage: imageUrl,
    owner: userId,
  });

  // Populate owner details for response (optional)
  const populatedTweet = await Tweet.findById(newTweet._id).populate(
    "owner",
    "username fullName avatar"
  );

  res
    .status(201)
    .json(new apiResponse(201, populatedTweet, "Tweet created successfully"));
});

const getUserChannelTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new apiError(404, "invalid id");
  }

  const getTweets = await Tweet.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
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
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetLiked",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetDisliked",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "comments",
      },
    },
    {
      $addFields: {
        tweetLikeCount: {
          $size: "$tweetLiked",
        },
        tweetDislikeCount: {
          $size: "$tweetDisliked",
        },
        commentCount: {
          $size: "$comments",
        },

        isTweetLiked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$tweetLiked",
                        as: "tweetLike",
                        in: "$$tweetLike.likedBy",
                      },
                    },
                  ],
                },
              ],
            },
            true,
            false,
          ],
        },
        isTweetDisliked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$tweetDisliked",
                        as: "tweetDislike",
                        in: "$$tweetDislike.dislikeBy",
                      },
                    },
                  ],
                },
              ],
            },
            true,
            false,
          ],
        },
      },
    },
    {
      $project: {
        tweetLiked: 0,
        tweetDisliked: 0,
        comments: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!getTweets) {
    return new apiResponse(200, null, "tweet not found");
  }

  res.status(200).json(new apiResponse(200, getTweets, "get all of tweets"));
});

const getUserTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "invalid id");
  }

  const getTweetById = await Tweet.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(tweetId) },
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
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetLiked",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetDisliked",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "comments",
      },
    },

    {
      $addFields: {
        tweetLikeCount: {
          $size: "$tweetLiked",
        },
        tweetDislikeCount: {
          $size: "$tweetDisliked",
        },
        commentCount: {
          $size: "$comments",
        },

        isTweetLiked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$tweetLiked",
                        as: "tweetLike",
                        in: "$$tweetLike.likedBy",
                      },
                    },
                  ],
                },
              ],
            },
            true,
            false,
          ],
        },
        isTweetDisliked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$tweetDisliked",
                        as: "tweetDislike",
                        in: "$$tweetDislike.dislikeBy",
                      },
                    },
                  ],
                },
              ],
            },
            true,
            false,
          ],
        },
      },
    },
    {
      $project: {
        tweetLiked: 0,
        tweetDisliked: 0,
        comments: 0,

      },
    },
  ]);

  if (!getTweetById) {
    return new apiResponse(200, null, "tweet not found");
  }

  const tweetById = getTweetById[0];

  res.status(200).json(new apiResponse(200, tweetById, "get all of tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

 

  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "invalid id");
  }

  const updateTweetDB = await Tweet.findByIdAndUpdate(
    tweetId,
    { content: content },
    { new: true }
  );

  res
    .status(200)
    .json(new apiResponse(200, updateTweetDB, "tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "invalid id");
  }

  await Tweet.findByIdAndDelete(tweetId);

  res.status(200).json(new apiResponse(200, null, "deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const getTweets = await Tweet.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetLiked",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetDisliked",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "comments",
      },
    },
    {
      $addFields: {
        tweetLikeCount: {
          $size: "$tweetLiked",
        },
        tweetDislikeCount: {
          $size: "$tweetDisliked",
        },
        commentCount: {
          $size: "$comments",
        },
      },
    },
  ]);

  if (!getTweets) {
    return new apiResponse(200, null, "tweet not found");
  }

  res.status(200).json(new apiResponse(200, getTweets, "get all of tweets"));
});

export {
  createTweet,
  getUserTweets,
  getUserChannelTweets,
  getUserTweetById,
  updateTweet,
  deleteTweet,
};
