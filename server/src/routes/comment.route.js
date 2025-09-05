import { Router } from "express";
import {
  addTweetComment,
  addVideoComment,
  deleteComment,
  getTweetComments,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { optionalVerifyJwt } from '../middlewares/optionalAuth.middleware.js';


const router = Router();

router.route("/all-video-comments/:videoId").get(optionalVerifyJwt, getVideoComments);
router.route("/all-tweet-comments/:tweetId").get(optionalVerifyJwt, getTweetComments);

router.route("/add-video-comment").post(verifyJwt, addVideoComment);
router.route("/add-tweet-comment").post(verifyJwt, addTweetComment);

router.route("/update-comment").patch(verifyJwt, updateComment);
router.route("/delete-comment").delete(verifyJwt, deleteComment);

export default router;
