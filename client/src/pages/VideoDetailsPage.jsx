import {
  IoThumbsUp,
  IoThumbsDown,
  IoShareSocial,
  IoEllipsisHorizontal,
  IoNotifications,
  IoThumbsUpOutline,
  IoThumbsDownOutline,
} from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { Link, useParams } from "react-router";
import { format, formatDistanceToNow } from "date-fns";
import { MdNotificationsActive } from "react-icons/md";
import { useState, useEffect } from "react";
import staticAvatar from "../assets/static-avatar.jpg";
import { useCurrentUser } from "./../hooks/user/useCurrentUser";
import { useGetVideoId } from "./../hooks/videos/useGetVideoId";
import { useProfileDetails } from "./../hooks/user/useProfileDetails";
import { useGetVideoComment } from "./../hooks/comment/useGetVideoComment";
import { useGetUserChannalVideos } from "../hooks/user/useGetUserChannalVideos";
import { useSubscribeToogle } from "./../hooks/user/useSubscribeToogle";
import { useToggleVideoLike } from "./../hooks/like/useToggleVideoLike";
import { useToggleCommentLike } from "./../hooks/like/useToggleCommentLike";
import { useToggleVideoDislike } from "./../hooks/dislike/useToggleVideoDislike";
import CommentSortDropdown from "../components/ui/dropdown/CommentSortDropdown";
import { durationFormat } from "../utils/durationFormat";
import Loading from "../components/ui/loading/Loading";
import { useToggleCommentDislike } from "../hooks/dislike/useToggleCommentDislike";
import { useCreateVideoComment } from "../hooks/comment/useCreateVideoComment";
import { useLayoutContext } from "../hooks/context/useLayoutContext";

const VideoDetailsPage = () => {
  const { setOpenLogin, sidebarOpen, useSidebarVideoDetails } =
    useLayoutContext()
  const { id } = useParams();

  // stats
  const [sugesstionVideos, setSugesstionVideos] = useState();
  const [commentContent, setCommentContent] = useState();
  const [sort, setSort] = useState();

  // apis
  const {
    data: currentUser,
    isLoading: currentUserLoading,
    isError: currentUserError,
  } = useCurrentUser();

  const {
    data: video,
    isLoading: videoLoading,
    isError: videoError,
  } = useGetVideoId(id);
  
  const {
    data: profileDetails,
    isLoading: profileLoading,
    isError: profileError,
  } = useProfileDetails(video?.ownerDetails?.userName);
  const { data: videoComments, isLoading: videoCommentLoading } =
    useGetVideoComment({ videoId: id, sort });
 
  const {
    data: userVideos,
    isLoading: sugesstionVideoLoading,
    isError: sugesstionVideoError,
  } = useGetUserChannalVideos(profileDetails?._id);

  const { mutate: addVideoComment, isPending } = useCreateVideoComment();
  const {
    mutate: subscribeMutate,
    isPending: Subscribing,
    isSuccess: SubscribeToogleSuccessfull,
  } = useSubscribeToogle();

  const { mutate: likeToggleVideos } = useToggleVideoLike();
  const { mutate: dislikeToggleVideos } = useToggleVideoDislike();

  const { mutate: likeToggleComment } = useToggleCommentLike();
  const { mutate: dislikeToggleComment } = useToggleCommentDislike();

  // func
  const handleSubscribe = () => {
    subscribeMutate(profileDetails?._id);
  };

  const handleVideoLikeToggle = () => {
    likeToggleVideos(id);
  };

  const handleVideoDislikeToggle = () => {
    dislikeToggleVideos(id);
  };

  const handleCommentLikeToggle = (commentId) => {
    likeToggleComment(commentId);
  };

  const handleCommentDislikeToggle = (commentId) => {
    dislikeToggleComment(commentId);
  };


  const handleComment = () => {
    if (currentUser) {
      const payload = {
        content: commentContent,
        videoId: video?._id,
      };
      addVideoComment(payload, {
        onSuccess: () => {
          setCommentContent("");
        },
      });
    } else {
      setCommentContent("");
      setOpenLogin(true);
    }
  };

  //side Effect
  useEffect(() => {
    if (userVideos?.latest) {
      const filteredVideos = userVideos.latest.filter((v) => v._id !== id);
      setSugesstionVideos(filteredVideos);
    }
  }, [userVideos, id]);


  useEffect(() => {
    // Only apply overflow hidden when the regular sidebar is open (not SideBarVideoDetails)
    if (sidebarOpen && !useSidebarVideoDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen, useSidebarVideoDetails]);

  if (videoLoading) return <Loading />;
  if (profileLoading) return <Loading />;
  if (sugesstionVideoLoading) return <Loading />;
  if (videoCommentLoading) return <Loading />;

  return (
    <div>
      <div className="min-h-screen bg-[var(--background)] text-[var-(--foreground)] md:mt-10 mt-3">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 px-2 sm:px-4 lg:px-6 pb-6">
            {/* Video Player */}
            {video?.videoFile && (
              <div
                className="relative w-full bg-black rounded-lg overflow-hidden mb-4"
                style={{ aspectRatio: "16/9", maxHeight: "715px" }}
              >
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <source src={video.videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Video Info */}
            <div className="mb-6">
              <h1 className="text-xl font-semibold mb-3">{video?.title}</h1>

              <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                      <img
                        src={video?.ownerDetails?.avatar}
                        alt="Channel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {video?.ownerDetails?.fullName}
                      </div>
                      <div className="text-sm">
                        {profileDetails?.subscriberCount} subscribers
                      </div>
                    </div>
                  </div>
                  {currentUser ? (
                    profileDetails?.isSubscribed ? (
                      <button
                        onClick={handleSubscribe}
                        className="bg-[var(--foreground)] text-[var(--background)] font-semibold px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-sm sm:text-base rounded-3xl cursor-pointer flex items-center gap-1 sm:gap-2"
                      >
                        <MdNotificationsActive className="h-4 w-4 sm:h-5 sm:w-5" />
                        Subscribed
                      </button>
                    ) : (
                      <button
                        onClick={handleSubscribe}
                          className="bg-[var(--foreground)] cursor-pointer text-[var(--background)] rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-sm sm:text-base flex items-center gap-1 sm:gap-2"
                      >
                        <IoNotifications className="h-3 w-3 sm:h-4 sm:w-4" />
                        Subscribe
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => setOpenLogin((prv) => !prv)}
                        className="bg-[var(--foreground)] cursor-pointer text-[var(--background)] rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-sm sm:text-base flex items-center gap-1 sm:gap-2"
                    >
                      <IoNotifications className="h-3 w-3 sm:h-4 sm:w-4" />
                      Subscribe
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2 sm:mt-0">
                  <div className="flex rounded-full">
                    <button
                      onClick={
                        currentUser
                          ? handleVideoLikeToggle
                          : () => setOpenLogin((prv) => !prv)
                      }
                      disabled={video?.isDisliked}
                      className={`rounded-l-full px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base ${video?.isDisliked
                        ? "text-[var(--secondary)] cursor-not-allowed"
                        : "text-[var(--foreground)] cursor-pointer"
                        } flex items-center gap-1 sm:gap-2`}
                    >
                      {video?.isLiked ? (
                        <IoThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <IoThumbsUpOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {video?.likedCount}
                    </button>
                    <div className="w-px bg-gray-300 my-2"></div>
                    <button
                      onClick={
                        currentUser
                          ? handleVideoDislikeToggle
                          : () => setOpenLogin((prv) => !prv)
                      }
                      disabled={video?.isLiked}
                      className={`rounded-r-full px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base ${video?.isLiked
                        ? "text-[var(--secondary)] cursor-not-allowed"
                        : "text-[var(--foreground)] cursor-pointer"
                        } flex items-center gap-1 sm:gap-2`}
                    >
                      {video?.isDisliked ? (
                        <IoThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <IoThumbsDownOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {video?.disLikedCount}
                    </button>
                  </div>
                  <button className="rounded-full px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    <IoShareSocial className="h-4 w-4 sm:h-5 sm:w-5" />
                    Share
                  </button>
                  <button className="rounded-full px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    <CiBookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Video Description */}
            <div className="rounded-lg px-4 mb-6">
              <div className="text-sm mb-2">
                {video?.views} views •
                {format(new Date(video.createdAt), "MMM dd, yyyy")}
              </div>
              <div className="text-sm">
                <p className="mb-2">{video?.description}</p>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {videoComments ? videoComments.length : 0} Comments
                </h3>
                <CommentSortDropdown sort={setSort} />
              </div>

              {/* Add Comment */}
              <div className="flex gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                  <img
                    src={currentUser ? currentUser.avatar : staticAvatar}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[var(--secondary)] pb-2 text-sm sm:text-base text-[var(--foreground)] placeholder-gray-500 outline-none focus:border-black"
                    placeholder="Add a comment..."
                  />
                  <div className="flex justify-end mt-2 sm:mt-3">
                    <button
                      onClick={handleComment}
                      type="submit"
                      className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-[var(--foreground)] cursor-pointer text-[var(--background)] rounded"
                    >
                      {isPending ? "Commenting...." : "Comment"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 sm:space-y-4 mt-4">
                {videoComments &&
                  videoComments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                        <img
                          src={comment.ownerDetails.avatar}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-semibold text-xs sm:text-sm">
                            @{comment.ownerDetails.userName}
                          </span>
                          <span className="text-xs sm:text-sm">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm mb-1 sm:mb-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <button
                            onClick={
                              currentUser
                                ? () => handleCommentLikeToggle(comment._id)
                                : () => setOpenLogin((prv) => !prv)
                            }
                            disabled={comment?.isCommentDisliked}
                            className={`flex items-center gap-1 text-xs sm:text-sm ${comment?.isCommentDisliked
                              ? "text-[var(--muted)] cursor-not-allowed"
                              : "text-[var(--foreground)] cursor-pointer"
                              }`}
                          >
                            {comment?.isCommentLiked ? (
                              <IoThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <IoThumbsUpOutline className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            {comment?.commentLikedCount}
                          </button>
                          <button
                            onClick={
                              currentUser
                                ? () => handleCommentDislikeToggle(comment._id)
                                : () => setOpenLogin((prv) => !prv)
                            }
                            disabled={comment?.isCommentLiked}
                            className={`text-xs sm:text-sm ${comment?.isCommentLiked
                              ? "text-[var(--muted)] cursor-not-allowed"
                              : "text-[var(--foreground)] cursor-pointer"
                              }`}
                          >
                            {comment?.isCommentDisliked ? (
                              <IoThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <IoThumbsDownOutline className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar with Recommended Videos */}
          <div className="w-full lg:w-[425px] px-2 sm:px-4 lg:px-6 pb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Up next
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {sugesstionVideos &&
                sugesstionVideos.map((video) => (
                  <Link
                    to={`/video/${video._id}`}
                    key={video._id}
                    className="flex gap-2 sm:gap-3 group cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 sm:w-40 h-20 sm:h-24 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-[10px] sm:text-xs px-1 py-0.5 rounded">
                        {durationFormat(video.duration)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs sm:text-sm leading-4 sm:leading-5 mb-1 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs mb-1">
                        {video.channel}
                      </p>
                      <p className="text-[10px] sm:text-xs">
                        {video.views} views •{" "}
                        {formatDistanceToNow(new Date(video.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1">
                      <IoEllipsisHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoDetailsPage;
