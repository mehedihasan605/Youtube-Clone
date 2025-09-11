import { formatDistanceToNow } from "date-fns";
import { IoList } from "react-icons/io5";
import { Link } from "react-router";


const PlaylistCard = ({ playlist }) => {
  
  return (
    <Link to={`/playlist/${playlist._id}`} key={`${playlist._id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
          <img
            src={playlist?.playlistImage || playlist?.videos[0]?.thumbnail}
            alt={playlist?.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <IoList className="w-3 h-3" />
            {playlist?.videos.length}
          </div>
        </div>
        <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-blue-600">
          {playlist?.name}
        </h3>
        <div className="text-sm">
          Updated{" "}
          {playlist &&
            formatDistanceToNow(new Date(playlist.updatedAt), {
              addSuffix: true,
            })}
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;