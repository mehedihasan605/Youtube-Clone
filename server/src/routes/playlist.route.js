import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addMultipleVideosToPlaylist,
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserChannelPlaylists,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/c/playlists/:userId").get(getUserChannelPlaylists);
router
  .route("/c/user-playlists/:userId")
  .get(verifyJwt, getUserChannelPlaylists);
router.route("/user-playlists").get(verifyJwt, getUserPlaylists);
router.route("/c/playlistbyid/:playlistId").get(getPlaylistById);

router.route("/create-playlist").post(verifyJwt, createPlaylist);
router
  .route("/update-playlist/:playlistId")
  .patch(upload.single("playlistImage"), verifyJwt, updatePlaylist);
router.route("/delete-playlist/:playlistId").delete(verifyJwt, deletePlaylist);


router
  .route("/add-video/:videoId/:playlistId")
  .patch(verifyJwt, addVideoToPlaylist);
router
  .route("/add-videos")
  .patch(verifyJwt, addMultipleVideosToPlaylist);
router
  .route("/remove-video/:videoId/:playlistId")
  .patch(verifyJwt, removeVideoFromPlaylist);


export default router;
