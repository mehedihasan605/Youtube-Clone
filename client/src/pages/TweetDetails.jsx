import { useParams } from "react-router";
import Tweet from "../components/profile/tweet/Tweet";
import { useGetTweetById } from "../hooks/tweet/useGetTweetById";
import { useGetTweetComment } from "../hooks/comment/useGetTweetComment";
import CommentSortDropdown from "../components/ui/dropdown/CommentSortDropdown";
import { useState } from "react";
import { useCurrentUser } from "../hooks/user/useCurrentUser";
import staticAvatar from "../assets/static-avatar.jpg";
import { formatDistanceToNow } from "date-fns";
import { useCreateTweetComment } from "../hooks/comment/useCreateTweetComment";
import {
  IoThumbsDown,
  IoThumbsDownOutline,
  IoThumbsUp,
  IoThumbsUpOutline,
} from "react-icons/io5";
import { useToggleCommentLike } from "../hooks/like/useToggleCommentLike";
import { useToggleCommentDislike } from "../hooks/dislike/useToggleCommentDislike";
import { useToggleTweetLike } from "../hooks/like/useToggleTweetLike";
import { useToggleTweetDislike } from "../hooks/dislike/useToggleTweetDislike";

const TweetDetails = ({
  setOpenLogin,
  sidebarOpen,
  setSidebarOpen,
  hideSidebar,
}) => {
  // states
  const { tweetId } = useParams();
  const [sort, setSort] = useState();
  const [commentContent, setCommentContent] = useState("");

  // apis
  const { data: tweet } = useGetTweetById(tweetId);
  const { data: tweetComment } = useGetTweetComment({
    tweetId: tweetId,
    sort: sort,
  });
  const { data: currentUser } = useCurrentUser();

  const { mutate: addTweetComment, isPending } = useCreateTweetComment();

  const { mutate: toggleTweetLike } = useToggleTweetLike();
  const { mutate: toggleTweetDislike } = useToggleTweetDislike();
  const { mutate: likeToggleComment } = useToggleCommentLike();
  const { mutate: dislikeToggleComment } = useToggleCommentDislike();

  // func
  const handleComment = () => {
    if (currentUser) {
      const payload = {
        content: commentContent,
        tweetId: tweetId,
      };
      addTweetComment(payload, {
        onSuccess: () => {
          setCommentContent("");
        },
      });
    } else {
      setCommentContent("");
      setOpenLogin(true);
    }
  };

  const handleToggleTweetLike = (id) => {
    toggleTweetLike(id);
  };

  const handleToggleTweetDislike = (id) => {
    toggleTweetDislike(id);
  };

  const handleCommentLikeToggle = (commentId) => {
    likeToggleComment(commentId);
  };

  const handleCommentDislikeToggle = (commentId) => {
    dislikeToggleComment(commentId);
  };

  return (
    <div
      className={`flex w-full justify-center mt-24 sm:mt-28  ${
        sidebarOpen ? "ml-30" : "ml-0"
      }`}
    >
      <div
        className={`w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl space-y-8 py-4 px-4 sm:px-6 lg:px-8`}
      >
        <Tweet
          tweet={tweet}
          handleToggleTweetLike={handleToggleTweetLike}
          handleToggleTweetDislike={handleToggleTweetDislike}
        />

        {/* Comments Section */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold">
              {tweetComment ? tweetComment.length : 0} Comments
            </h3>
            <CommentSortDropdown sort={setSort} />
          </div>

          {/* Add Comment */}
          <div className="flex gap-3">
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
                className="w-full bg-transparent border-0 border-b border-gray-300 pb-2 text-black placeholder-gray-500 outline-none focus:border-black text-sm sm:text-base"
                placeholder="Add a comment..."
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleComment}
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-black cursor-pointer text-white rounded text-sm sm:text-base"
                >
                  {isPending ? "Commenting...." : "Comment"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {tweetComment &&
              tweetComment.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                    <img
                      src={comment.ownerDetails.avatar}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs sm:text-sm">
                        @{comment.ownerDetails.userName}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        onClick={
                          currentUser
                            ? () => handleCommentLikeToggle(comment._id)
                            : () => setOpenLogin((prv) => !prv)
                        }
                        disabled={comment?.isCommentDisliked}
                        className={`flex items-center gap-1 ${
                          comment?.isCommentDisliked
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 cursor-pointer"
                        }`}
                      >
                        {comment?.isCommentLiked ? (
                          <IoThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <IoThumbsUpOutline className="h-4 w-4 sm:h-5 sm:w-5" />
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
                        className={
                          comment?.isCommentLiked
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 cursor-pointer"
                        }
                      >
                        {comment?.isCommentDisliked ? (
                          <IoThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <IoThumbsDownOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetDetails;
