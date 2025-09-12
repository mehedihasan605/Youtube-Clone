import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { ViewLog } from "../models/viewlog.model.js";


const getAllVideos = asyncHandler(async (req, res) => {
  const { page, limit = 6, query, sortBy, sortType } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 6;

  const queryObj = {};
  if (query) {
    queryObj.title = { $regex: query, $options: "i" };
  }

  const sortObj = {};
  if (sortBy) {
    sortObj[sortBy] = sortType === "dsc" ? -1 : 1;
  }

  const videos = await Video.find(queryObj)
    .populate("owner", "fullName userName email avatar")
    .sort(sortObj)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.status(200).json({
    videos,
    total: await Video.countDocuments(queryObj), // total videos for pagination
    page: pageNum,
    limit: limitNum
  });

});

const UserChannalVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new apiError(400, "User not valid");
  }

  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const last30DaysVideos = await Video.find({
    owner: userId,
    createdAt: { $gte: last30Days },
  }).sort({ createdAt: -1 });

  const latest = await Video.find({ owner: userId }).sort({ createdAt: -1 });

  const oldest = await Video.find({ owner: userId }).sort({ createdAt: 1 });

  const populer = await Video.find({ owner: userId }).sort({ views: -1 });

  const populerWithLimit = await Video.find({ owner: userId })
    .sort({ views: -1 })
    .limit(10);

  res.status(200).json(
    new apiResponse(
      200,
      {
        latest,
        oldest,
        populer,
        populerWithLimit,
        last30DaysVideos,
      },
      "videos get successfully"
    )
  );
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const videoLocalPath = req.files.video[0]?.path;
  const thumbnailLocalPath = req.files.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new apiError(400, "video file not found");
  }

  if (!thumbnailLocalPath) {
    throw new apiError(400, "thumbnail not found");
  }

  const video = await uploadFileOnCloudinary(videoLocalPath);
  const thumbnail = await uploadFileOnCloudinary(thumbnailLocalPath);

  if (!video?.url) {
    throw new apiError(404, "video not uploded");
  }

  if (!thumbnail?.url) {
    throw new apiError(404, "video not uploded");
  }

  const publishVideo = await Video.create({
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: video?.duration,
    owner: req.user._id,
  });

  res
    .status(200)
    .json(new apiResponse(200, publishVideo, "video Uploded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id || null;

  if (!videoId) {
    throw new apiError(404, "video not found");
  }

  if (!isValidObjectId(videoId)) {
    throw new apiError(404, "invalid id");
  }

  const videoData = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
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
              email: 1,
              avatar: 1,
              userName: 1,
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
        foreignField: "video",
        as: "liked",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "video",
        as: "disliked",
      },
    },

    {
      $addFields: {
        likedCount: {
          $size: "$liked",
        },
        disLikedCount: {
          $size: "$disliked",
        },

        isLiked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$liked",
                        as: "like",
                        in: "$$like.likedBy",
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
        isDisliked: {
          $cond: [
            {
              $and: [
                { $ne: [req.user, null] },
                {
                  $in: [
                    req.user?._id,
                    {
                      $map: {
                        input: "$disliked",
                        as: "dislike",
                        in: "$$dislike.dislikeBy",
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
        liked: 0,
        disliked: 0,
      },
    },
  ]);

  const getVideo = videoData[0];

  if (!getVideo) {
    throw new apiError(404, "video not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, getVideo, "video get successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "videoId invalid");
  }

  const updatedData = {};
  if (title) updatedData.title = title
  if(description) updatedData.description = description

  if (req.file?.path) {
    const thumbnail = await uploadFileOnCloudinary(req.file?.path);
    if (thumbnail?.url) {
      updatedData.thumbnail = thumbnail.url;
    }
  }

  const update = await Video.findByIdAndUpdate(videoId, updatedData, {
    new: true,
  });

  if (!update) {
    throw new apiError(404, "Video not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, update, "details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "invalid videoId");
  }

  const videoDelete = await Video.findByIdAndDelete(videoId);

  if (!videoDelete) {
    throw new apiError(404, "video not deleted");
  }

  res
    .status(200)
    .json(new apiResponse(200, videoDelete, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new apiError(404, "video id invalid");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new apiError(404, "video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res
    .status(200)
    .json(new apiResponse(200, video, "toogle status change successfully"));
});


const addVideoView = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user?._id || null;
  const ip = req.ip;


  // Check if view already counted in the last 1 hour
  const existingView = await ViewLog.findOne({
    video: videoId,
    $or: [{ user: userId }, { ipAddress: ip }],
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // 1 hour ago
  });

  if (existingView) {
    return res.status(200).json({ message: "View already counted" });
  }

  // Save view log
  await ViewLog.create({
    video: videoId,
    user: userId,
    ipAddress: ip,
  });

  // Increment view count
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  res.status(200).json({ message: "View added" });
});


export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  UserChannalVideos,
  addVideoView,
};
