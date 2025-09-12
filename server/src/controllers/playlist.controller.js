import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, isPublished, description } = req.body;
  const userId = req?.user._id;

  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid user ID");
  }

  const createdPlaylist = await PlayList.create({
    owner: userId,
    name: name,
    isPublished: isPublished,
    description: description,
  });

  res
    .status(200)
    .json(new apiResponse(200, createdPlaylist, "playlist added successfully"));
});

const getUserChannelPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const { sortBy = "createdAt" } = req.query;

  if (!isValidObjectId(userId)) {
    throw new apiError(400, "invalid id");
  }

  const sortOption = {};
  sortOption[sortBy] = -1; // DESCENDING order

  const findPlaylist = await PlayList.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "playlistOwner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$playlistOwner",
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "videoOwner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              videoOwner: {
                $first: "$videoOwner",
              },
            },
          },
        ],
      },
    },
    {
      $sort: sortOption, // ✅ Dynamic Sort
    },
  ]);

  if (!findPlaylist) {
    return res
      .status(200)
      .json(new apiResponse(200, null, "playlist not found"));
  }

  res
    .status(200)
    .json(new apiResponse(200, findPlaylist, "playlist get successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const findPlaylist = await PlayList.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              thumbnail: 1,
              views: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalViews: { $sum: "$videos.views" },
      },
    },
  ]);

  if (!findPlaylist) {
    return res
      .status(200)
      .json(new apiResponse(200, null, "playlist not found"));
  }

  res
    .status(200)
    .json(new apiResponse(200, findPlaylist, "playlist get successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "invalid id");
  }

  const getPlaylist = await PlayList.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "playlistOwner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$playlistOwner",
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "videoOwner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              videoOwner: {
                $first: "$videoOwner",
              },
            },
          },
        ],
      },
    },
  ]);

  const playList = getPlaylist[0];

  if (!playList) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "playlist not found"));
  }

  res
    .status(200)
    .json(new apiResponse(200, playList, "playlist get successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid playlist ID or video ID");
  }

  const playlist = await PlayList.findById(playlistId);

  if (!playlist) {
    return res
      .status(200)
      .json(new apiResponse(400, null, "playlist not found"));
  }

  if (playlist.video.includes(videoId)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Video already exists in playlist"));
  }

  playlist.video.push(videoId);
  await playlist.save();

  res.status(200).json(new apiResponse(200, null, "video addedd successfully"));
});

const addMultipleVideosToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videos } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }

  if (!Array.isArray(videos) || videos.length === 0) {
    throw new apiError(400, "No videos provided");
  }

  const playlist = await PlayList.findById(playlistId);
  if (!playlist) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Playlist not found"));
  }

  // নতুন video গুলা আগের video এর সাথে যুক্ত করো, ডুপ্লিকেট বাদ দিয়ে
  const newVideos = videos.filter(
    (vid) => isValidObjectId(vid) && !playlist.video.includes(vid)
  );

  playlist.video.push(...newVideos);
  await playlist.save();

  res
    .status(200)
    .json(new apiResponse(200, playlist, "Videos added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid playlist ID or video ID");
  }
  const playlist = await PlayList.findById(playlistId);
  if (!playlist.video.includes(videoId)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Video Not Found in Playlist"));
  }

  const updatedPlaylist = await PlayList.findByIdAndUpdate(
    playlistId,
    { $pull: { video: videoId } },
    { new: true }
  );

  res
    .status(200)
    .json(new apiResponse(200, updatedPlaylist, "video removed successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "invalid playlist id");
  }

  await PlayList.findByIdAndDelete(playlistId);

  res.status(200).json(new apiResponse(200, null, "deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "invalid playlist id");
  }

  let imageUrl = null;
  let playlistImageLocalPath;

  // Handle image upload if file is provided
  if (req.file) {
    playlistImageLocalPath = req.file.path;
    
    try {
      const imageFile = await uploadFileOnCloudinary(playlistImageLocalPath);

      if (!imageFile?.url) {
        throw new apiError(500, "Failed to upload image to cloudinary");
      }

      imageUrl = imageFile.url;
    } catch (error) {
      throw error;
    }
  }
  const updatedObj = {};

  if (name) updatedObj.name = name;
  if (description) updatedObj.description = description;
  if (imageUrl) updatedObj.playlistImage = imageUrl;

  const updatedPlaylistDB = await PlayList.findByIdAndUpdate(
    playlistId,
    updatedObj,
    { new: true, upsert: true }
  );

  res
    .status(200)
    .json(new apiResponse(200, updatedPlaylistDB, "updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  addMultipleVideosToPlaylist,
  getUserChannelPlaylists,
};
