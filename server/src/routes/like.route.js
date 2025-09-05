import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJwt);

router.route("/toggle/video").post(toggleVideoLike);
router.route("/toggle/comment").post(toggleCommentLike);
router.route("/toggle/tweet").post(toggleTweetLike);

router.route("/liked-videos").get(getLikedVideos);

export default router;
