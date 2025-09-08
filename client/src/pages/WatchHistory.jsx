import { TfiClose } from "react-icons/tfi";
import { useGetWatchHistory } from "../hooks/videos/useGetWatchHistory";
import { durationFormat } from "../utils/durationFormat";
import { useRemovedVideoWatchHistory } from "../hooks/videos/useRemovedVideoWatchHistory";
import { useLayoutContext } from "../hooks/context/useLayoutContext";
import LogoutPage from "./LogoutPage";

const WatchHistory = () => {
  const { currentUser } = useLayoutContext();
  const { data: watchHistory, isLoading } = useGetWatchHistory();
  const { mutate } = useRemovedVideoWatchHistory();

  const handleRemove = (id) => {
    mutate(id);
  };


  return (
    <div>
      <div
        className={`min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
      >
        {currentUser ? <>
          <div className="max-w-7xl px-4 py-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  Watch history
                </h1>

                {/* Tab */}
                <div className="flex gap-3 mb-4">
                  <button className="rounded-full px-4 py-2 text-sm font-medium transition-colors bg-[var(--foreground)] text-[var(--background)]">
                    All
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              <h2 className="text-xl font-bold mb-4">Today</h2>

              <div className="space-y-4">
                {watchHistory &&
                  watchHistory.map((video) => (
                    <div
                      key={video.videos._id}
                      className="hover:bg-[var(--secondary)] transition-colors rounded-lg"
                    >
                      <div className="flex gap-4 p-2 justify-around items-center md:justify-start">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.videos.thumbnail}
                            alt={video.videos.title}
                            className="w-[246px] h-[138px] object-cover rounded-lg"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {durationFormat(video.videos.duration)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 hidden md:block">
                          <h3 className="text-lg font-medium line-clamp-2 mb-1 leading-5">
                            {video.videos.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs mb-2">
                            <span>{video.videos.ownerDetails.fullName}</span>
                            <span>•</span>
                            <span>{video.videos.views} views</span>
                          </div>
                          <p className="text-xs line-clamp-2 leading-4">
                            {video.videos.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-start gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleRemove(video._id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--secondary)] rounded-full transition-colors cursor-pointer"
                          >
                            <TfiClose size={25} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </> : <LogoutPage title={'Keep track of what you watch'} message={'Watch history isnt viewable when signed out.'}/>}


     
      </div>
    </div>
  );
};
export default WatchHistory;
