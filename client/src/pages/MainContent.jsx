import { formatDistanceToNow, set } from "date-fns";
import { Link, useLocation, useNavigate } from "react-router";
import { IoEllipsisVertical } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useAddVideosWatchlater } from "../hooks/videos/useAddVideosWatchlater";
import { useViewCount } from "../hooks/videos/useViewCount";
import { useCurrentUser } from "./../hooks/user/useCurrentUser";
import { useGetUserPlaylists } from "./../hooks/playlist/useGetUserPlaylists";
import { useAddVideoPlaylist } from "./../hooks/playlist/useAddVideoPlaylist";
import { useRemoveVideoPlaylist } from "./../hooks/playlist/useRemoveVideoPlaylist";
import { useCreatePlaylists } from "./../hooks/playlist/useCreatePlaylists";
import { useAddVideoInHistory } from "./../hooks/videos/useAddVideoInHistory";
import Loading from "../components/ui/loading/Loading";
import { durationFormat } from "./../utils/durationFormat";
import ThreeDotModal from "../components/ui/dropdown/ThreeDot";
import PlaylistAddVideoModal from "../components/ui/modal/PlaylistAddVideo";
import NewPlaylistModal from "../components/ui/modal/NewPlaylist";
import { useLayoutContext } from "../hooks/context/useLayoutContext";
import { useInView } from "react-intersection-observer";
import LogoutPage from "./LogoutPage";

const categories = [
  "All",
  "React",
  "JavaScript",
  "Web Development",
  "Programming",
  "Computer Science",
  "Technology",
  "Education",
  "Music",
  "Gaming",
  "Sports",
  "News",
  "Operating systems",
  "Computer Hardware",
];

const MainContent = () => {
  // context
  const {
    videos,
    videosLoading,
    subscriptionVideos,
    subscriptionVideosLoading,
    sidebarOpen,
    setSearchQuery,
    searchQuery,
    videoHasNextPage,
    videoFetchNextPage,
    videoStatus,
    videoIsFetchingNextPage,
    subscriptionHasNextPage,
    subscriptionFetchNextPage,
    subscriptionStatus,
    subscriptionIsFetchingNextPage,
  } = useLayoutContext();

 
  const location = useLocation();
  const navigate = useNavigate();

  const isSubscriptionPage = location.pathname.startsWith("/subscriptions");
  const data = isSubscriptionPage ? subscriptionVideos : videos;
  const hasNextPage = isSubscriptionPage ? subscriptionHasNextPage : videoHasNextPage;
  const fetchNextPage = isSubscriptionPage ? subscriptionFetchNextPage : videoFetchNextPage;
  const status = isSubscriptionPage ? subscriptionStatus : videoStatus;
  const isFetchingNextPage = isSubscriptionPage ? subscriptionIsFetchingNextPage : videoIsFetchingNextPage;



  // states
  const { mutate: watchlater } = useAddVideosWatchlater();
  const { mutate: viewsCount } = useViewCount();


  const [openThreeDot, setOpenThreeDot] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(null);
  const [isNewPlaylistModalOpen, setNewPlaylistModalOpen] = useState(null);

  // apis calling....
  const { data: currentUser } = useCurrentUser();
  const { data: userPlaylists } = useGetUserPlaylists(currentUser?._id);

  const { mutate: addVideoPlaylist } = useAddVideoPlaylist();
  const { mutate: removeVideoPlaylist } = useRemoveVideoPlaylist();
  const { mutateAsync: createPlaylist, isPending: createPlaylistLoading } =
    useCreatePlaylists();
  const { mutate: videoAddWatchHistory } = useAddVideoInHistory();




  const handleCardClick = (e, videoId) => {
    const clickedElement = e.target;

    // Exclude clicks on 3-dot, avatar or any element with a specific class

    const isExcludedClick = clickedElement.closest(".exclude-click");

    if (!isExcludedClick) {
      videoAddWatchHistory(videoId); // ✅ Your function
      navigate(`/video/${videoId}`);
      viewsCount(videoId);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery(category === "All" ? "" : searchQuery);
  };



  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (status === "loading") return <div>Loading....</div>;


 
  if (isSubscriptionPage && !currentUser) {
    return <LogoutPage title={'Don’t miss new videos'} message="Sign in to see updates from your favorite YouTube channels" />;
  }


  if (videosLoading || subscriptionVideosLoading) return <Loading />;

  return (
    <div>
      {/* Main content */}
      <main>
        {/* Category tabs */}
        <div className="sticky top-16 bg-[var(--background)] z-30">
          <div className="flex gap-2 sm:gap-3 px-2 sm:px-4 md:px-6 py-2 sm:py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className={`whitespace-nowrap px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full cursor-pointer ${selectedCategory === category
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--secondary)] hover:bg-[var(--foreground)] text-[var(--foreground)] hover:text-[var(--background)]"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Video grid */}
        <div className="p-2 sm:p-4 md:px-6 md:py-8">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${sidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
              } gap-x-2 sm:gap-x-4 gap-y-4 sm:gap-y-6`}
          >
            {data.map((video) =>
            (
              <div
                onClick={(e) => handleCardClick(e, video._id)}
                key={video._id}
                className="cursor-pointer group w-full max-w-full relative"
              >
                {/* Thumbnail linked to Video Details */}
                <div className="relative">
                  <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="w-full aspect-video object-cover rounded-lg bg-gray-200"
                  />
                  <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black text-white bg-opacity-80 text-[10px] sm:text-xs px-1 py-0.5 rounded">
                    {durationFormat(video?.duration)}
                  </div>
                </div>

                {/* Info row */}
                <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3 items-start justify-between">
                  {/* Avatar */}
                  <Link
                    to={`/channal/${video?.owner?.userName}`}
                    className="exclude-click"
                  >
                    <img
                      src={video?.owner?.avatar}
                      alt={video?.owner?.fullName}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-center object-cover rounded-full bg-gray-200 flex-shrink-0"
                    />
                  </Link>

                  {/* Title + Views */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base md:text-lg line-clamp-2">
                      {video?.title}
                    </h3>

                    <Link
                      to={`/channal/${video?.owner?.userName}`}
                      className="exclude-click"
                    >
                      <span className="text-[var(--foreground)] text-xs sm:text-sm mt-0.5 sm:mt-1">
                        {video?.owner?.fullName}
                      </span>
                    </Link>

                    <p className="text-[var(--foreground)] text-xs sm:text-sm">
                      {video?.views} views •{" "}
                      {formatDistanceToNow(new Date(video?.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {/* 3-dot button */}
                  <div className="exclude-click">
                    <button
                      onClick={() =>
                        setOpenThreeDot(openThreeDot === video._id ? null : video._id)
                      }
                      className="p-1 cursor-pointer"
                    >
                      <IoEllipsisVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>


                    {openThreeDot === video._id && (
                  <ThreeDotModal
                    video={video}
                    watchlater={watchlater}
                    closeModal={() => setOpenThreeDot(null)}
                    openPlaylistModal={setPlaylistModalOpen}
                  />
                )}

                {isPlaylistModalOpen === video._id && (
                  <PlaylistAddVideoModal
                    isOpen={isPlaylistModalOpen}
                    onClose={() => setPlaylistModalOpen(null)}
                    onNewPlaylistClick={setNewPlaylistModalOpen}
                    userPlaylists={userPlaylists}
                    addVideoPlaylist={addVideoPlaylist}
                    removeVideoPlaylist={removeVideoPlaylist}
                    videoId={video._id}
                  />
                )}

                {isNewPlaylistModalOpen === video._id && (
                  <NewPlaylistModal
                    isOpen={isNewPlaylistModalOpen}
                    onClose={() => setNewPlaylistModalOpen(null)}
                    createPlaylist={createPlaylist}
                    createPlaylistLoading={createPlaylistLoading}
                    addVideoPlaylist={addVideoPlaylist}
                    videoId={video._id}
                  />
                )}
                  </div>
                </div>

                
              </div>
            )

            )}

          </div>
          <div ref={ref} className="py-4 text-center">
            {isFetchingNextPage && <span className="loading loading-spinner loading-lg"></span>}
          </div>
        </div>

      </main>


    </div>
  );
};

export default MainContent;
