import { Router } from "express";
import { verifyJwt } from "./../middlewares/auth.middleware.js";

import {
  getWatchedVideos,
  watchedVideoAdd,
  watchedVideoRemove,
} from "../controllers/watched.controller.js";

const router = Router();
router.use(verifyJwt);

router.route("/get-watched-videos").get(getWatchedVideos);
router.route("/add-video").post(watchedVideoAdd);
router.route("/remove-video/:historyId").delete(watchedVideoRemove);

export default router;
