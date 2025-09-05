import mongoose, { isValidObjectId } from "mongoose";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Dislike } from "../models/dislike.model.js";

const toggleVideoDislike = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new apiError(404, "video id invalid");
  }

  const disLikeDocument = await Dislike.findOne({
    video: videoId,
    dislikeBy: req?.user._id,
  });

  if (disLikeDocument) {
    await disLikeDocument.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "dislike successfully"));
  }

  await Dislike.create({
    video: videoId,
    dislikeBy: req?.user._id,
  });

  res
    .status(200)
    .json(new apiResponse(200, null, "video dislike successfully"));
});

const toggleCommentDislike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  if (!isValidObjectId(commentId)) {
    throw new apiError(404, "comment id invalid");
  }

  const disLikeDocument = await Dislike.findOne({
    comment: commentId,
    dislikeBy: req?.user._id,
  });

  if (disLikeDocument) {
    await disLikeDocument.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "dislike successfully"));
  }

  await Dislike.create({
    comment: commentId,
    dislikeBy: req?.user._id,
  });

  res
    .status(200)
    .json(new apiResponse(200, null, "comment dislike successfully"));
});

const toggleTweetDislike = asyncHandler(async (req, res) => {
  const { tweetId } = req.body;
  if (!isValidObjectId(tweetId)) {
    throw new apiError(404, "tweet id invalid");
  }

  const disLikeDocument = await Dislike.findOne({
    tweet: tweetId,
    dislikeBy: req?.user._id,
  });

  if (disLikeDocument) {
    await disLikeDocument.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "dislike successfully"));
  }

  await Dislike.create({
    tweet: tweetId,
    dislikeBy: req?.user._id,
  });

  res
    .status(200)
    .json(new apiResponse(200, null, "tweet dislike successfully"));
});

export { toggleVideoDislike, toggleCommentDislike, toggleTweetDislike };
