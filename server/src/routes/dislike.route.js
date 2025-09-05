import { Router } from "express";
import { verifyJwt } from "./../middlewares/auth.middleware.js";
import { toggleCommentDislike, toggleTweetDislike, toggleVideoDislike } from "../controllers/dislike.controller.js";


const router = Router();
router.use(verifyJwt);

router.route("/toggle/video").post(toggleVideoDislike);
router.route("/toggle/comment").post(toggleCommentDislike);
router.route("/toggle/tweet").post(toggleTweetDislike);


export default router;
