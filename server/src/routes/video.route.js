import { Router } from "express";
import {
  addVideoView,
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
  UserChannalVideos,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { optionalVerifyJwt } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

// public routes
router.route("/").get(getAllVideos);
router.route("/video/:videoId").get(optionalVerifyJwt, getVideoById);

// private routes
router.route("/post-video").post(
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyJwt,
  publishVideo
);

router
  .route("/update-video/:videoId")
  .patch(upload.single("thumbnail"), verifyJwt, updateVideo);
router.route("/delete-video/:videoId").delete(verifyJwt, deleteVideo);
router.route("/toogle-status/:videoId").patch(verifyJwt, togglePublishStatus);
router.route("/userChannalVideos/:userId").get(UserChannalVideos);

router.route("/:id/view").post(verifyJwt, addVideoView);


export default router;
