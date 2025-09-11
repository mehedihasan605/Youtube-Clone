import { HiDotsHorizontal } from "react-icons/hi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { BiMessageRounded } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";
import Loading from "../../ui/loading/Loading";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";

const Tweet = ({ tweet, handleToggleTweetLike, handleToggleTweetDislike }) => {
  const { ownerDetails, tweetImage, content } = tweet || {};
  const location = useLocation();
  const navigate = useNavigate();
  const sortRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);


  // Function to toggle the dropdown's visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigateToEdit = () => {
    navigate('/studio/content')
    localStorage.setItem('activeContentTab', "Tweets");
  }

 

  // sort dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!tweet) return <Loading />;

  return (
    <div className="w-full bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-lg overflow-hidden border border-[var(--secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--secondary)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img
              src={ownerDetails?.avatar}
              className="w-10 h-10 object-center object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold  text-sm">
              {ownerDetails?.fullName}
            </h3>
            <p className=" text-xs">
              {formatDistanceToNow(new Date(tweet.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div className="relative" ref={sortRef}>
          <button onClick={toggleDropdown} className="p-1 cursor-pointer rounded-full transition-colors">
            <HiDotsHorizontal className="w-5 h-5" />
          </button>
          {/* Dropdown menu, show/hide based on state */}
          {isOpen && (
            <div className="absolute right-1 rounded-md shadow-lg">
              <div className="py-1">
                <button onClick={handleNavigateToEdit} href="#" className="px-4 py-2 text-sm cursor-pointer">
                  Edit
                </button>
               
              </div>
            </div>
          )}
    </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="mb-3">{content}</p>

        {/* Post Image */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={tweetImage}
            alt="iPhone in hand"
            className={`w-2xl ${
              location.pathname.startsWith("/tweet/")
                ? "max-h-[500px]"
                : "h-2xl"
            } object-cover rounded-3xl`}
          />
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => handleToggleTweetLike(tweet?._id)}
            disabled={tweet.isTweetDisliked}
            className={`flex items-center space-x-2 px-3 py-2 ${
              tweet.isTweetDisliked
              ? "text-[var(--muted)] cursor-not-allowed"
              : "hover:bg-[var(--foreground)] cursor-pointer"
            } rounded-lg transition-colors group`}
          >
            {tweet.isTweetLiked ? (
              <AiFillLike className="w-5 h-5  group-hover:text-blue-600 transition-colors" />
            ) : (
              <AiOutlineLike className="w-5 h-5  group-hover:text-red-600 transition-colors" />
            )}
            <span className="text-sm font-medium group-hover:text-blue-600">
              {tweet.tweetLikeCount}
            </span>
          </button>

          <button
            onClick={() => handleToggleTweetDislike(tweet?._id)}
            disabled={tweet.isTweetLiked}
            className={`flex items-center space-x-2 px-3 py-2 ${
              tweet.isTweetLiked
              ? "text-[var(--muted)] cursor-not-allowed"
              : "hover:bg-[var(--foreground)] cursor-pointer"
            } rounded-lg transition-colors group`}
          >
            {tweet.isTweetDisliked ? (
              <AiFillDislike className="w-5 h-5  group-hover:text-blue-600 transition-colors" />
            ) : (
              <AiOutlineDislike className="w-5 h-5  group-hover:text-red-600 transition-colors" />
            )}
          </button>

          <button className="cursor-pointer flex items-center space-x-2 px-3 py-2 hover:bg-gray-200 rounded-lg transition-colors group">
            <TbShare3 className="w-5 h-5  group-hover:text-green-600 transition-colors" />
          </button>

          {!location.pathname.startsWith("/tweet/") && (
            <Link to={`/tweet/${tweet?._id}`}>
              <button className="cursor-pointer flex items-center space-x-2 px-3 py-2 hover:bg-gray-200 rounded-lg transition-colors group">
                <BiMessageRounded className="w-5 h-5  group-hover:text-purple-600 transition-colors" />
                <span className="text-sm font-medium  group-hover:text-purple-600">
                  {tweet?.commentCount}
                </span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweet;
