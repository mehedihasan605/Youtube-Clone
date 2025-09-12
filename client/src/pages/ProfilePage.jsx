
import { useEffect, useState } from "react";
import {
  IoNotifications,
  IoCheckmarkCircle,
} from "react-icons/io5";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useProfileDetails } from "../hooks/user/useProfileDetails";
import { useCurrentUser } from "../hooks/user/useCurrentUser";
import { useGetUserPlaylists } from "../hooks/playlist/useGetUserPlaylists";
import { useGetUserChannalVideos } from "../hooks/user/useGetUserChannalVideos";
import { useGetAllTweets } from "../hooks/tweet/useGetAllTweets";
import { useUserProfileUpdate } from "../hooks/user/useUserProfileUpdate";
import { useSubscribeToogle } from "../hooks/user/useSubscribeToogle";
import Loading from "../components/ui/loading/Loading";
import { MdNotificationsActive, MdOutlinePlaylistPlay } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import toast from "react-hot-toast";
import VideoCard from "../components/profile/video/VideoCard";
import ChannalVideos from "../components/profile/video/ChannalVideos";
import PlaylistCard from "../components/profile/playlist/PlaylistCard";
import SortDropdown from "../components/ui/dropdown/SortDropdown";
import Tweet from "../components/profile/tweet/Tweet";
import { FaVideoSlash } from "react-icons/fa6";
import defaultCoverImage from "../assets/background-1939128_1280.jpg";
import { useToggleTweetLike } from "../hooks/like/useToggleTweetLike";
import { useToggleTweetDislike } from "../hooks/dislike/useToggleTweetDislike";
import CreateTweet from "../components/profile/tweet/CreateTweet";
import { useCreateTweet } from "../hooks/tweet/useCreateTweet";

import { useLayoutContext } from "../hooks/context/useLayoutContext";


const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userName } = useParams();

  const {
    sidebarOpen,
    setOpenLogin,
  } = useLayoutContext();

    // states
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Home";
  });

  const [sortBy, setSortBy] = useState("createdAt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModal, setImageModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);



  // variable
  const tabs = ["Home", "Videos", "Playlists", "Tweets"];


  // api caling...
  const { data: userProfile, isPending: userProfileLoading } =
    useProfileDetails(userName);
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const { data: userPlaylists = [], isLoading: userPlaylistLoading } =
    useGetUserPlaylists(userProfile?._id, sortBy);
  const { data: userVideos, isLoading: userVideosLoading } =
    useGetUserChannalVideos(userProfile?._id);
  const { data: userTweets, isLoading: userTweetsLoading } = useGetAllTweets(
    userProfile?._id
  );
  const { mutate: createTweet } = useCreateTweet();

  const {
    mutate,
    isPending: profileUpdating,
    isError,
    error,
    isSuccess,
  } = useUserProfileUpdate();
  const {
    mutate: subscribeMutate,
    isPending: Subscribing,
    isSuccess: SubscribeToogleSuccessfull,
  } = useSubscribeToogle();

  const { mutate: toggleTweetLike } = useToggleTweetLike();
  const { mutate: toggleTweetDislike } = useToggleTweetDislike();
  const { latest, oldest, last30DaysVideos, populer, populerWithLimit } =
    userVideos || {};

  // functions
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenImageModal = () => setImageModal(true);
  const handleCloseImageModal = () => setImageModal(false);

  const navigateStudio = () => {
    navigate("/studio/customization");
  };

  const onSubmitData = (data, reset) => {
    mutate(data, {
      onSuccess: () => {
        handleCloseModal(true);
        queryClient.invalidateQueries(["profileDetails"]);
        toast.success("Account Updated SuccessFully");
        reset();
      },
    });
  };

  const handleSubscribe = () => {
    subscribeMutate(userProfile?._id);
  };
  const handleToggleTweetLike = (tweetId) => {
    toggleTweetLike(tweetId);
  };

  const handleToggleTweetDislike = (tweetId) => {
    toggleTweetDislike(tweetId);
  };

  // loading.....
  if (userProfileLoading) return <Loading />;



 const renderTabContent = () => {
    switch (activeTab) {
      case "Home":
        return userVideos?.last30DaysVideos?.length > 0 ? (
          <div>
            {/* for you */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                For You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {last30DaysVideos &&
                  last30DaysVideos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
              </div>
            </div>
            <div className="divider"></div>
            {/* pupolar */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Pupolar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {populerWithLimit &&
                  populerWithLimit.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
              </div>
            </div>
            <div className="divider"></div>
            {/* playlists */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Created Playlists
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist?._id} playlist={playlist} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">
              <FaVideoSlash />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              No posts yet
            </h2>
            <p className="">
              This channel hasn't Uploaded Videos yet.
            </p>
          </div>
        );

      case "Videos":
        return userVideos?.latest?.length > 0 ? (
          <ChannalVideos latest={latest} populer={populer} oldest={oldest} />
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">
              <FaVideoSlash />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              No posts yet
            </h2>
            <p className="">
              This channel hasn't Uploaded Videos yet.
            </p>
          </div>
        );

      case "Playlists":
        return userPlaylists?.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Created playlists
              </h2>
              <SortDropdown onSortChange={setSortBy} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userPlaylists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">
              <MdOutlinePlaylistPlay />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              No Created Playlist yet
            </h2>
            <p className="">
              This channel hasn't Createad Playlist yet.
            </p>
          </div>
        );

      case "Tweets":
        return userTweets?.length > 0 ? (
          <div className="max-w-4xl py-4">
            <div>
              {
                currentUser.userName === userProfile?.userName && (
                  <CreateTweet
                    currentUser={currentUser}
                    createTweet={createTweet}
                  />
            )}
            </div>
         <div className="space-y-3 my-2">
              {userTweets &&
                userTweets.map((tweet) => (
                  <Tweet
                    key={tweet._id}
                    tweet={tweet}
                    handleToggleTweetLike={handleToggleTweetLike}
                    handleToggleTweetDislike={handleToggleTweetDislike}
                  />
                ))}
         </div>
          </div>
        ) : (
            <div>
              <div className="max-w-4xl space-y-8 py-4">
                {
                  currentUser.userName === userProfile?.userName && (
                    <CreateTweet
                      currentUser={currentUser}
                      createTweet={createTweet}
                    />
                  )}
             </div>
              <div className="py-16 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold mb-2">
                No posts yet
              </h2>
              <p className="">
                This channel hasn't posted anything to the Community tab yet.
              </p>
         </div>
          </div>
        );

      default:
        return null;
    }
  };


  return (
    <div className="flex w-full mt-5 lg:mt-13">

      <div
        className={`w-full max-w-full px-2 sm:px-4 md:px-6 lg:px-8 ${sidebarOpen ? "lg:ml-30" : "lg:ml-20 xl:ml-30"
          } `}
      >
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Channel Banner */}
      <div className="w-full rounded-2xl h-48 md:h-56 relative">
        <img
          src={
            userProfile?.coverImage
              ? userProfile?.coverImage
              : defaultCoverImage
          }
          alt="ATC Android ToTo Company Banner"
          className="object-cover h-full w-full rounded-2xl object-center"
        />
      </div>

      {/* Channel Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-[var(--secondary)] shadow-lg flex items-center justify-center relative">
              <img
                src={userProfile?.avatar}
                className="object-cover w-full h-full rounded-full object-center"
                alt=""
              />
            </div>
          </div>

          {/* Channel Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {userProfile?.fullName}
              </h1>
              <IoCheckmarkCircle className="w-6 h-6" />
            </div>

            <div className="mb-2">
              <span className="mr-4">@{userProfile?.userName}</span>
              <span className="mr-4">
                {userProfile?.subscriberCount} subscribers
              </span>
              <span>{userProfile?.totalVideos} videos</span>
            </div>

            <p className="mb-3">
             {userProfile?.description}
            </p>
            {currentUser ? (
              currentUser?.userName === userProfile?.userName ? (
                <div>
                  <button
                    onClick={navigateStudio}
                    className="flex items-center gap-2 bg-[var(--foreground)] py-2 px-4 justify-center text-[var(--background)] rounded-3xl cursor-pointer"
                  >
                    <HiOutlinePencilSquare />
                    <p className="font-medium">Update Channal</p>
                  </button>
                </div>
              ) : userProfile?.isSubscribed ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubscribe}
                      className="bg-[var(--foreground)] text-[var(--background)] font-semibold px-6 py-2 rounded-3xl cursor-pointer flex items-center gap-2"
                  >
                    <MdNotificationsActive size={25} />
                    Subscribed
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubscribe}
                        className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2 rounded-full flex items-center gap-2 font-medium transition-colors"
                  >
                    <IoNotifications className="w-4 h-4" />
                    Subscribe
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpenLogin((prv) => !prv)}
                    className="bg-[var(--foreground)] hover:bg-gray-800 px-6 py-2 rounded-full flex items-center gap-2 font-medium transition-colors"
                >
                  <IoNotifications className="w-4 h-4" />
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[var(--muted)] mt-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab
                    ? "border-[var(--foreground)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default ProfilePage;
