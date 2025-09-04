import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  getUserProfile,
  getUserVideos,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAccount,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { optionalVerifyJwt } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secreat routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/new-refresh-token").post(refreshAccessToken);
router.route("/change-password").patch(verifyJwt, changePassword);
router.route("/account-update").patch(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  verifyJwt,
  updateUserAccount
);


router.route("/user-profile/:userName").get(optionalVerifyJwt, getUserProfile);

router.route("/user-videos").get(verifyJwt, getUserVideos);

export default router;
