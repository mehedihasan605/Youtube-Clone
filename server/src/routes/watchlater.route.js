import { Router } from "express";
import { verifyJwt } from "./../middlewares/auth.middleware.js";
import {
  getWatchlaterVideos,
  watchlaterVideoAdd,
  watchlaterVideoRemove,
} from "../controllers/watchlater.controller.js";

const router = Router();
router.use(verifyJwt);

router.route("/get-watchlater-videos").get(getWatchlaterVideos);
router.route("/add-video").post(watchlaterVideoAdd);
router.route("/remove-video/:watchlaterId").delete(watchlaterVideoRemove);

export default router;
