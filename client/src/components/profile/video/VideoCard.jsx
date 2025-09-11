import { formatDistanceToNow } from "date-fns";
import { durationFormat } from "../../../utils/durationFormat";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router"; // Note: use 'react-router-dom'

const VideoCard = ({ video }) => {
  return (
    <div className="relative group cursor-pointer">
      {/* Thumbnail with Link */}
      <Link to={`/video/${video._id}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="object-cover w-full group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {durationFormat(video.duration)}
          </div>
        </div>
      </Link>

      {/* Title + Views + 3-dot icon */}
      <div className="flex justify-between gap-3 items-start">
        {/* Title and views (wrapped in Link) */}
        <Link to={`/video/${video._id}`} className="flex-1">
          <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-blue-600">
            {video.title}
          </h3>
          <div className="text-sm ">
            {video.views} Views •{" "}
            {formatDistanceToNow(new Date(video?.createdAt), {
              addSuffix: true,
            })}
          </div>
        </Link>

        {/* 3-dot icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // openModal or toggle logic
          }}
          className="p-1"
        >
          <IoEllipsisVertical size={16} />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
