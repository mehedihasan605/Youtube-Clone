import { useEffect, useRef, useState } from "react";
import { useGetWatchlaterVideos } from "../hooks/videos/useGetWatchlaterVideos";
import { useRemoveWatchlater } from "../hooks/videos/useRemoveWatchlater";
import { useLayoutContext } from "../hooks/context/useLayoutContext";
import LogoutPage from "./LogoutPage";
import Loading from "../components/ui/loading/Loading";
import { durationFormat } from "../utils/durationFormat";
import { getUpdatedLabel } from "../utils/getUpdatedLabel";
import WatchLaterSort from "../components/ui/dropdown/WatchLaterSort";
import { FaPlay, FaRandom } from "react-icons/fa";
import { TfiDownload } from "react-icons/tfi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineSort } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const WatchLater = () => {
  const {  currentUser } = useLayoutContext();
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState("newest");
  const { data: videos, isLoading } = useGetWatchlaterVideos(sort);
  const { mutate: watchlaterRemove } = useRemoveWatchlater();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleRemove = (id) => {
    watchlaterRemove(id);
  };

  const sortRef = useRef(null);

  // sort dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {
        currentUser ? (<div>

           <div className="min-h-screen">
      <div>
        <div className="pt-16 sm:pt-20 px-2 sm:px-4 lg:px-6">
          {/* Mobile Layout */}
          {isMobile ? (
            <div className="space-y-4">
              {/* Mobile Header */}
              <div className="rounded-lg p-4 shadow-sm">
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={videos?.videos[0]?.thumbnail}
                      alt="Playlist thumbnail"
                      className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">
                      {videos && videos.likedVideos
                        ? "Liked Videos"
                        : "Watch later"}
                    </h1>
                    <p className="text-sm mb-1">
                      {videos?.ownerDetails?.fullName}
                    </p>
                    <p className="text-xs">
                      {videos && videos.videos.length} videos •{" "}
                      {videos?.totalViews} views
                    </p>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 text-sm">
                    <FaPlay size={12} />
                    Play all
                  </button>
                  <button className="flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 text-sm">
                    <FaRandom size={12} />
                    Shuffle
                  </button>
                </div>

                {/* Mobile Sort and Filter */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  {!videos?.likedVideos && (
                    <div className="relative flex items-center">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-3 py-1.5 flex items-center gap-2 rounded-full text-sm whitespace-nowrap"
                      >
                        <MdOutlineSort size={16} />
                        Sort
                      </button>
                      {isOpen && (
                        <WatchLaterSort
                          setIsOpen={setIsOpen}
                          onSortChange={setSort}
                        />
                      )}
                    </div>
                  )}
                  <button className="bg-[var(--foreground)] text-[var(--background)] text-sm px-3 py-1.5 rounded-full whitespace-nowrap">
                    All
                  </button>
                  <button className="text-sm px-3 py-1.5 rounded-full hover:bg-gray-200 whitespace-nowrap">
                    Videos
                  </button>
                </div>
              </div>

              {/* Mobile Video List */}
              <div className="space-y-2">
                {videos &&
                  videos.videos.map((video) => (
                    <div
                      key={video._id}
                      className="bg-white rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex gap-3">
                        {/* Mobile Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-32 h-20 sm:w-40 sm:h-24 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                            {durationFormat(video.duration)}
                          </div>
                        </div>

                        {/* Mobile Video Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm leading-5 mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <div className="text-xs space-y-1">
                            <p>{video.videoOwner.fullName}</p>
                            <div className="flex items-center gap-1">
                              <span>{video.views} Views</span>
                              <span>•</span>
                              <span>{getUpdatedLabel(video.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Menu */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() =>
                              handleRemove(
                                videos?.likedVideos
                                  ? video?._id
                                  : video?.watchId
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            <AiOutlineClose size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* Desktop Layout */
            <div className="flex gap-6">
              {/* Desktop Sidebar */}
              <div className="w-80 xl:w-96 flex-shrink-0">
                <div className="sticky top-20 rounded-xl p-6 shadow-sm">
                  <div className="relative mb-4">
                    <img
                      src={videos?.videos[0]?.thumbnail}
                      alt="Playlist thumbnail"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 hover:bg-[var(--muted)] opacity-20 rounded-lg transition-opacity"></div>
                  </div>

                  <h1 className="text-2xl font-bold mb-2">
                    {videos && videos.likedVideos
                      ? "Liked Videos"
                      : "Watch later"}
                  </h1>

                  <div className="mb-4">
                    <p className="font-medium">
                      {videos?.ownerDetails?.fullName}
                    </p>
                    <p className="text-sm">
                      {videos && videos.videos.length} videos •{" "}
                      {videos?.totalViews} views •{" "}
                      {videos && getUpdatedLabel(videos?.lastAt)}
                    </p>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <button className="w-10 h-10 flex justify-center items-center rounded-full bg-[var(--secondary)] transition-colors">
                      <TfiDownload size={20} />
                    </button>
                    <button className="w-10 h-10 flex justify-center items-center rounded-full bg-[var(--secondary)]  transition-colors">
                      <BsThreeDotsVertical size={25} />
                    </button>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button className="flex-1 bg-[var(--foreground)] text-[var(--background)] py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                      <FaPlay />
                      Play all
                    </button>
                    <button className="flex-1 bg-[var(--foreground)] text-[var(--background)] py-2 px-4 flex items-center justify-center gap-2 rounded-full transition-colors">
                      <FaRandom /> Shuffle
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Main Content */}
              <div className="flex-1 min-w-0">
                {/* Desktop Sort and Filter */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {!videos?.likedVideos && (
                      <div className="relative flex items-center" ref={sortRef}>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className="px-3 cursor-pointer py-2 flex items-center gap-2 pr-4 rounded-lg transition-colors"
                        >
                          <MdOutlineSort size={20} />
                          Sort
                        </button>
                        <div className="absolute right-0 top-[30%] h-[40%] w-[2px] rounded"></div>
                        {isOpen && (
                          <div>
                            <WatchLaterSort
                              setIsOpen={setIsOpen}
                              onSortChange={setSort}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="bg-[var(--foreground)] text-[var(--background)] text-sm px-4 py-2 rounded-full">
                        All
                      </button>
                      <button className="text-sm px-4 py-2 rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
                        Videos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Video List */}
                <div className="space-y-3">
                  {videos &&
                    videos.videos.map((video) => (
                      <div
                        key={video._id}
                        className="flex gap-4 p-3 hover:bg-[var(--secondary)] rounded-lg transition-colors cursor-pointer"
                      >
                        {/* Desktop Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-48 h-28 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                            {durationFormat(video.duration)}
                          </div>
                        </div>

                        {/* Desktop Video Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium leading-5 mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <div className="text-sm flex gap-2">
                            <p>{video.videoOwner.fullName}</p>
                            <span>•</span>
                            <span>{video.views} Views</span>
                            <span>•</span>
                            <span>{getUpdatedLabel(video.createdAt)}</span>
                          </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() =>
                              handleRemove(
                                videos?.likedVideos
                                  ? video?._id
                                  : video?.watchId
                              )
                            }
                            className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors cursor-pointer"
                          >
                            <AiOutlineClose />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>


        </div>) : (<LogoutPage title={'See Your WatchLater Videos please SignIn'} message={'WatchLater Videos isnt viewable when signed out.'} />)
      }
    </div>
  );
};

export default WatchLater;
