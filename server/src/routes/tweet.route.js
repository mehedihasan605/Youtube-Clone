import { Router } from "express";
import { verifyJwt } from "./../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserChannelTweets,
  getUserTweetById,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { optionalVerifyJwt } from "../middlewares/optionalAuth.middleware.js";

const router = Router();



router.route("/tweets/:userId").get(optionalVerifyJwt, getUserChannelTweets);
router.route("/tweetById/:tweetId").get(optionalVerifyJwt, getUserTweetById);
router.route("/create-tweets").post(upload.single('tweetImage'), verifyJwt, createTweet);
router.route("/update-tweets/:tweetId").patch(verifyJwt, updateTweet);

router.route("/delete-tweets/:tweetId").delete(verifyJwt, deleteTweet);

router.route("/user-tweets").get(verifyJwt, getUserTweets);



export default router;
