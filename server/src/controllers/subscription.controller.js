import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channalId } = req.body;
  // TODO: toggle subscription

  if (!isValidObjectId(channalId)) {
    throw new apiError(404, "invalid channelId");
  }

  const isSubscribed = await Subscription.findOne({
    channel: channalId,
    subscriber: req?.user._id,
  });

  if (isSubscribed) {
    await isSubscribed.deleteOne();
    return res
      .status(200)
      .json(new apiResponse(200, null, "channel succssfully unsubscribe"));
  }

  const subscribed = Subscription.create({
    subscriber: req?.user._id,
    channel: channalId,
  });

  res
    .status(200)
    .json(new apiResponse(200, null, "channel succssfully subscribe"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new apiError(404, "invalid id");
  }

  const subscriber = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "fullName username, avatar"
  );

  const totalSubscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        subscriber,
        { totalSubscriber: totalSubscriberCount },
        "get the all subscriber"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  if (!req?.user._id) {
    return res.status(400).json(new apiResponse(400, null, "User Not Found"));
  }

  const subscribedChannels = await Subscription.find({
    subscriber: req?.user._id,
  }).populate("channel", "fullName avatar userName");

  const totalSubscribedCount = await Subscription.countDocuments({
    subscriber: req?.user._id,
  });

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        subscribedChannels,
        { totalSubscribed: totalSubscribedCount },
        "get the all subscribed channels"
      )
    );
});



const subscriptionFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit, query = "", sortBy = "createdAt", sortType = "dsc" } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const queryObj = {};
  if (query && typeof query === "string") {
    queryObj.title = { $regex: query, $options: "i" };
  }

  // get all subscribed channels
  const subscribedChannels = await Subscription.find({ subscriber: userId }).select("channel");

  const channelIds = subscribedChannels.map((sub) => sub.channel);

  // get videos from subscribed channels with pagination and sorting
  const videos = await Video.find({ owner: { $in: channelIds }, ...queryObj })
    .populate({
      path: "owner",
      select: "fullName userName avatar email",
    })
    .sort({ [sortBy]: sortType === "dsc" ? -1 : 1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const total = await Video.countDocuments({ owner: { $in: channelIds }, ...queryObj });

  res.status(200).json(
    new apiResponse(
      200,
      {
        videos,
        total,
        page: pageNum,
        limit: limitNum,
      },
      "Fetched subscribed channel videos successfully"
    )
  );
});


export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  subscriptionFeed,
};
