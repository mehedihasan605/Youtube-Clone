import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10, sort } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new apiError(404, "INVALID ID");
  }

  const sortOrder = sort === "createdAt" ? -1 : 1; // default to descending
  const sortStage = sort ? { createdAt: sortOrder } : { createdAt: 1 };
  // fallback

  const getComments = await Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
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
              userName: 1,
              avatar: 1,
            },
          },
        ],
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails", // array থেকে object বানায়
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "commentLiked",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "comment",
        as: "commentDisliked",
      },
    },
    {
      $addFields: {
        commentLikedCount: {
          $size: "$commentLiked",
        },
        commentDislikedCount: {
          $size: "$commentDisliked",
        },
        isCommentLiked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$commentLiked",
                        as: "commentLike",
                        in: "$$commentLike.likedBy",
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
        isCommentDisliked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$commentDisliked",
                        as: "commentDislike",
                        in: "$$commentDislike.dislikeBy",
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
      $sort: sortStage,
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
    {
      $project: {
        commentLiked: 0,
        commentDisliked: 0,
      },
    },
  ]);

  res.status(200).json(new apiResponse(200, getComments, "get all comments"));
});

const getTweetComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { tweetId } = req.params;
  const { page = 1, limit = 10, sort } = req.query;

  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "INVALID ID");
  }

  const sortOrder = sort === "createdAt" ? -1 : 1; // default to descending
  const sortStage = sort ? { createdAt: sortOrder } : { createdAt: 1 };
  // fallback

  const getComments = await Comment.aggregate([
    {
      $match: { tweet: new mongoose.Types.ObjectId(tweetId) },
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
              userName: 1,
              avatar: 1,
            },
          },
        ],
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails", // array থেকে object বানায়
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "commentLiked",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "comment",
        as: "commentDisliked",
      },
    },
    {
      $addFields: {
        commentLikedCount: {
          $size: "$commentLiked",
        },
        commentDislikedCount: {
          $size: "$commentDisliked",
        },
        isCommentLiked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$commentLiked",
                        as: "commentLike",
                        in: "$$commentLike.likedBy",
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
        isCommentDisliked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$commentDisliked",
                        as: "commentDislike",
                        in: "$$commentDislike.dislikeBy",
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
      $sort: sortStage,
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
    {
      $project: {
        commentLiked: 0,
        commentDisliked: 0,
      },
    },
  ]);

  res.status(200).json(new apiResponse(200, getComments, "get all comments"));
});

const addVideoComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;
  const userId = req?.user._id;

  if (!isValidObjectId(videoId)) {
    throw new apiError(404, "invalid id");
  }

  await Comment.create({
    content: content,
    video: videoId,
    owner: userId,
  });

  res
    .status(200)
    .json(new apiResponse(200, null, "comment addedd successfully"));
});

const addTweetComment = asyncHandler(async (req, res) => {
  const { content, tweetId } = req.body;
  const userId = req?.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "invalid id");
  }

  await Comment.create({
    content: content,
    tweet: tweetId,
    owner: userId,
  });

  res
    .status(200)
    .json(new apiResponse(200, null, "comment addedd successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { content, CommentId } = req.body;

  if (!isValidObjectId(CommentId)) {
    throw new apiError(404, "invalid Id");
  }

  const updateCommentDB = await Comment.findByIdAndUpdate(
    CommentId,
    { content: content },
    { new: true }
  );

  res
    .status(200)
    .json(new apiResponse(200, updateCommentDB, "update Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new apiError(404, "invalid Id");
  }

  await Comment.findOneAndDelete(commentId);

  res.status(200).json(200, null, "deleted successfully");
});

export {
  getVideoComments,
  addVideoComment,
  getTweetComments,
  addTweetComment,
  updateComment,
  deleteComment,
};
