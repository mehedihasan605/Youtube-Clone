import { useParams } from "react-router";
import { useGetPlaylistbyId } from "../hooks/playlist/useGetPlaylistbyId";
import { FaPlay } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { RiShareForwardFill } from "react-icons/ri";
import { useDeleteVideoFromPlaylist } from "../hooks/playlist/useDeleteVideoFromPlaylist";
import {  useState } from "react";
import PlaylistModal from "../components/ui/modal/PlaylistModal";
import { formatDistanceToNow } from "date-fns";
import { BsThreeDotsVertical } from "react-icons/bs";
import { durationFormat } from "../utils/durationFormat";
;

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [isOpenModal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(null);


  const {
    data: playList,
    isLoading,
    isError,
    error,
  } = useGetPlaylistbyId(playlistId);

  const { name, playlistOwner, videos, description, _id } = playList || {};
  

  const { mutate, isPending } = useDeleteVideoFromPlaylist()

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);

  const handleVideoDelete = (videoId) => {
    console.log(videoId)
    mutate({ videoId: videoId, playlistId: playlistId })
  }





  if (isLoading) return <div>Loading playlist...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!playList) return <div>No playlist found</div>;


  return (
    <div className="flex gap-x-40 lg:mt-20 mt-4">
      <div className="p-2 sm:px-6 lg:px-8">
        <div className="grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Left Column - Playlist Details */}
          <div className="lg:col-span-1">
            <div className="flex min-h-[400px] lg:h-[700px] max-h-[90vh] sticky top-4 overflow-y-auto flex-col gap-3 rounded-xl bg-gradient-to-b from-teal-800 via-teal-900 to-gray-900 p-6 z-50">
      <img
        src={
          playList?.playlistImage
            ? playList?.playlistImage
            : videos[0]?.thumbnail
        }
        alt={videos[0]?.title}
        className="w-full rounded-xl shadow-lg"
      />
      <h1 className="text-3xl font-bold mt-2 text-white">{name}</h1>
      <div className="text-sm flex flex-col gap-y-2 mb-4">
        <div className="flex items-center gap-2">
          <img
            className="w-6 h-6 rounded-full object-cover object-center"
            src={playlistOwner?.avatar}
            alt=""
          />
          <p className="font-semibold text-white">
            by {playlistOwner.fullName}
          </p>
        </div>

        <p className="text-xs font-medium text-gray-300">
          Playlist • {videos.length} videos • {videos[0]?.views} views
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex flex-grow items-center justify-center gap-2 rounded-full bg-white cursor-pointer px-4 py-2 font-bold text-black transition hover:scale-105">
          <FaPlay className="text-white" /> Play all
        </button>
        <button
          onClick={handleOpenModal}
          className="rounded-full cursor-pointer bg-white/10 p-2.5 transition hover:bg-white/20"
        >
          <HiOutlinePencilSquare className="text-white" size={18} />
        </button>
        <button className="rounded-full cursor-pointer bg-white/10 p-2.5 transition hover:bg-white/20">
          <RiShareForwardFill className="text-white" size={18} />
        </button>

        <PlaylistModal
          isClose={handleCloseModal}
          isOpen={isOpenModal}
          playlistId={_id}
        />
      </div>
    </div>
          </div>

          {/* Right Column - Video List */}
          <div className="flex flex-col gap-2 lg:col-span-2">
            {videos &&
              videos.map((video, index) => (
                 <div className="flex cursor-pointer items-start gap-3 rounded-lg p-2">
      <span className="mt-8 text-sm">{index}</span>
      <div className="relative">
        <img
          src={video?.thumbnail}
          alt={video?.title}
          className="w-48 rounded-lg object-center object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
          {durationFormat(video?.duration)}
        </span>
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-lg mb-1">{video?.title}</h3>
        <p className="text-xs text-gray-400">
          {video?.videoOwner?.fullName} • {video.views} views •{" "}
          {formatDistanceToNow(new Date(video.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="relative">
        <button onClick={() => setIsOpen(prev => (prev === video._id ? null : video._id))} className="cursor-pointer">
          <BsThreeDotsVertical size={20} />
        </button>
        {/* Dropdown Menu */}
        {isOpen && isOpen === video._id && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg z-10">
            <div className="py-1">
           
              <button
                onClick={() => handleVideoDelete(video._id)}
                className="block px-4 py-2 text-sm cursor-pointer"
                
              >
                Delete Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
