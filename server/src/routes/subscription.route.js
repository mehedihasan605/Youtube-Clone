import { Router } from "express";
import { verifyJwt } from "./../middlewares/auth.middleware.js";
import {

  getSubscribedChannels,
  getUserChannelSubscribers,
  subscriptionFeed,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { optionalVerifyJwt } from "./../middlewares/optionalAuth.middleware.js";

const router = Router();

router.route("/c/subscribe").post(verifyJwt, toggleSubscription);
router.route("/c/subscriber/:channelId").get(getUserChannelSubscribers);
router.route("/c/subscribed").get(optionalVerifyJwt, getSubscribedChannels);
router.route("/c/subscription-feed").get(verifyJwt, subscriptionFeed);

export default router;
