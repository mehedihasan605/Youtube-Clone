import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from './../models/video.model.js';

const ganarateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genatateAccessToken();
    const refreshToken = user.genatateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Somthing went wrong while ganarating access or refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  // optional check
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw apiError(401, "Enter username & password");
  }

  if (!password) {
    throw apiError(401, "required password");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw apiError(404, "User Not Found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(402, "Password is Incorrect");
  }

  const { accessToken, refreshToken } = await ganarateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, { user: loggedInUser, accessToken, refreshToken }),
      "user loggedIn Successfully"
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "This is current user"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!oldRefreshToken) {
      throw new apiError(404, "User Not Found");
    }

    const decodedUserId = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedUserId._id);

    if (!user) {
      throw new apiError(401, "User Not Found");
    }

    if (oldRefreshToken !== user.refreshToken) {
      throw new apiError(402, "refreshToken not valid");
    }

    const { accessToken, refreshToken } = await ganarateAccessAndRefreshTokens(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(200),
        { accessToken, refreshToken },
        "token refresh succesfully"
      );
  } catch (error) {
    new apiError(401, error?.message || "Invalid refresh Token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  if (!newPassword || !oldPassword) {
    throw new apiError(400, "all Field are required");
  }

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(404, "password Incorrect please sent correct password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  // const user = await User.findByIdAndUpdate(req.user._id,{$set:{password: newPassword}},{new: true})

  return res
    .status(200)
    .json(new apiResponse(200, {}, "password change successfully"));
});

const updateUserAccount = asyncHandler(async (req, res) => {
  const { fullName, email, description } = req.body;

  
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


  if (!fullName && !email && !description && !avatarLocalPath && !coverImageLocalPath) {
    throw new apiError(400, "Please send update details");
  }

  let avatar, coverImage;
  if (avatarLocalPath) {
    avatar = await uploadFileOnCloudinary(avatarLocalPath);
    if (!avatar?.secure_url) {
      throw new apiError(500, "Cloudinary avatar file not uploaded");
    }
  }

  if (coverImageLocalPath) {
    coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
    if (!coverImage?.secure_url) {
      throw new apiError(500, "Cloudinary cover image file not uploaded");
    }
  }

  // updateField
  const updateField = {};
  if (fullName) updateField.fullName = fullName;
  if (email) updateField.email = email;
  if (description) updateField.description = description;
  if (avatar?.secure_url) updateField.avatar = avatar.url;
  if (coverImage?.secure_url) updateField.coverImage = coverImage.url;

  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateField },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res.status(200).json(
    new apiResponse(200, user, "User account updated successfully")
  );
});


const getUserProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new apiError(400, "username not found");
  }

  const channel = await User.aggregate([
    {
      $match: { userName: userName.toLowerCase() },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscriber",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscriber",
        },
        subscribedCount: {
          $size: "$subscribed",
        },
        totalVideos: {
          $size: "$videos",
        },
        isSubscribed: {
          $cond: {
            if: {
              $and: [
                { $ne: [req.user, null] },
                { $in: [req.user?._id, "$subscriber.subscriber"] },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscriberCount: 1,
        subscribedCount: 1,
        isSubscribed: 1,
        totalVideos: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(404, "Channel not exits");
  }

  return res
    .status(200)
    .json(new apiResponse(200, channel[0], "user profile get successfully"));
});

const getUserVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;



  if (!isValidObjectId(userId)) {
    throw new apiError(400, "Invalid video ID");
  }

  const videos = await Video.aggregate([
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
        as: "owner",
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
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "video",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        commentCount: {
          $size: "$comments",
        },
        likeCount: {
          $size: "$likes",
        },
        dislikeCount: {
          $size: "$dislikes",
        },
      },

    }

  ]);


  if (!videos) {
    throw new apiError(404, "Video not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, videos, "Video fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateUserAccount,
  getCurrentUser,
  getUserProfile,
  getUserVideos,
};
