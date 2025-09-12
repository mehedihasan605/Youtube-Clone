import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { format } from 'date-fns';
import {
  AiOutlineDislike,
  AiOutlineLike,
  AiTwotoneDelete,
} from 'react-icons/ai';
import { VscEdit } from 'react-icons/vsc';
import { useNavigate } from 'react-router';

import { IoList } from 'react-icons/io5';
import { useUserVideos } from './../hooks/user/useUserVideos';
import { useGetUserTweets } from './../hooks/tweet/useGetUserTweets';
import { useUserStudioPlaylists } from './../hooks/playlist/useUserStudioPlaylists';
import { durationFormat } from './../utils/durationFormat';
import { useLayoutContext } from '../hooks/context/useLayoutContext';
import VideoUploadModal from '../components/ui/modal/VideoUploadModal';
import PlaylistAddModal from '../components/ui/modal/PlaylistAddModal';
import { useDeleteVideo } from '../hooks/videos/useDeleteVideo';
import Swal from 'sweetalert2';
import { useDeleteTweet } from '../hooks/tweet/useDeleteTweet';
import { useDeletePlaylist } from '../hooks/playlist/useDeletePlaylist';

const Content = () => {
  const {
    setVideoUploadOpen,
    isVideoUploadOpen,
    uploadVideo,
    uploadingVideo,
    setPlaylist,
    isPlaylistOpen,
  } = useLayoutContext();
  const [activeContentTab, setActiveContentTab] = useState(() => {
    return localStorage.getItem('activeContentTab') || 'Video';
  });

  useEffect(() => {
    localStorage.setItem('activeContentTab', activeContentTab);
  }, [activeContentTab]);

  const { data: userVideos } = useUserVideos();
  const { data: userTweets } = useGetUserTweets();
  const { data: userPlaylists } = useUserStudioPlaylists();

  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: deleteTweet } = useDeleteTweet();
  const { mutate: deletePlaylist } = useDeletePlaylist();

  const [activeTab, setActiveTab] = useState('Videos');
  const navigate = useNavigate();

  const navigateDetails = (path, id) => {
    navigate(`/studio/${path}/${id}`);
  };

  const handleVideoDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        deleteVideo(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  };
  const handleTweetDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        deleteTweet(id);

        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  };

  const handlePlaylistDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        deletePlaylist(id);

        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  };

  const tabs = ['Videos', 'Tweets', 'Playlists'];

  // Mobile Card Component for Videos
  const VideoMobileCard = ({ video }) => (
    <div className="rounded-lg shadow-sm border border-[var(--secondary)] px-3 py-6 mb-4">
      <div className="flex gap-3 items-center">
        <div className="relative" style={{ width: '128px', height: '80px' }}>
          <div className="rounded-lg overflow-hidden w-full h-full">
            <img
              src={video.thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Duration Overlay */}
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded pointer-events-none">
            {durationFormat(video?.duration)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium  truncate">{video.title}</h3>
          <p className="text-xs  mt-1 line-clamp-2">
            {video.description.length > 50
              ? video.description.substring(0, 50) + '...'
              : video.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2  rounded-full"></div>
            <span className="text-xs ">
              {video?.isPublished ? 'Public' : 'Private'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs ">
              {format(new Date(video.createdAt), 'MMM dd, yyyy')}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateDetails('video-details', video?._id)}
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                <VscEdit size={16} />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <AiTwotoneDelete size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs ">
            <span>{video?.views} views</span>
            <span>{video?.commentCount} comments</span>
            <div className="flex items-center gap-1">
              <AiOutlineLike size={12} />
              <span>{video?.likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Card Component for Tweets
  const TweetMobileCard = ({ tweet }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-16 sm:w-32 sm:h-20 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            {tweet.tweetImage ? (
              <img
                src={tweet.tweetImage}
                alt="tweet thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs">No Image</span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium  line-clamp-3">{tweet.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs ">
              {tweet.tweetImage ? 'Image' : 'Text'}
            </span>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs ">
              {tweet?.isPublished ? 'Public' : 'Private'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {format(new Date(tweet.createdAt), 'MMM dd, yyyy')}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateDetails('tweet-details', tweet?._id)}
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                <VscEdit size={16} />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <AiTwotoneDelete size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{tweet?.views} views</span>
            <span>{tweet?.commentCount} comments</span>
            <div className="flex items-center gap-1">
              <AiOutlineLike size={12} />
              <span>{tweet?.tweetLikeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Card Component for Playlists
  const PlaylistMobileCard = ({ playlist }) => (
    <div className="bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-sm border border-[var(--secondary)] p-4 mb-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-shrink-0">
          <div className="relative w-24 h-16 sm:w-32 sm:h-20 bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={playlist?.playlistImage || playlist?.videos[0]?.thumbnail}
              alt={playlist?.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded flex items-center gap-1">
              <IoList className="w-3 h-3" />
              {playlist?.videos.length}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium  truncate">{playlist.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {playlist.description
              ? playlist.description.length > 50
                ? playlist.description.substring(0, 50) + '...'
                : playlist.description
              : 'No Description'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs ">playlist</span>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs ">
              {playlist?.isPublished ? 'Public' : 'Private'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {format(new Date(playlist.updatedAt), 'MMM dd, yyyy')}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigateDetails('playlist-details', playlist?._id)
                }
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                <VscEdit size={16} />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full">
                <AiTwotoneDelete size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{playlist?.videos.length} videos</span>
            <span>{playlist?.totalViews} total views</span>
          </div>
        </div>
      </div>
    </div>
  );

  const randerRows = () => {
    switch (activeContentTab) {
      case 'Videos':
        return userVideos?.map(video => (
          <div key={video._id}>
            {/* Desktop View */}
            <div className="hidden xl:block px-6">
              <div className="grid grid-cols-12 gap-4 py-4 items-center border-b border-[var(--secondary)] hover:bg-[var(--secondary)]">
                <div className="col-span-3 flex gap-3 group">
                  <div className="relative">
                    <div className="w-32 h-20 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                      {durationFormat(video?.duration)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium ">{video.title}</div>
                    <div className="text-sm group-hover:hidden">
                      {video.description.length > 20
                        ? video.description.substring(0, 20) + '...'
                        : video.description}
                    </div>
                    <div className="hidden group-hover:block">
                      <div className="flex items-center gap-3 py-3">
                        <button
                          onClick={() =>
                            navigateDetails('video-details', video?._id)
                          }
                          className="p-2 rounded-full cursor-pointer"
                        >
                          <VscEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleVideoDelete(video?._id)}
                          className="p-2 rounded-full cursor-pointer"
                        >
                          <AiTwotoneDelete size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm ">
                    {video?.isPublished ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-sm ">
                    {format(new Date(video.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm ">{video?.views}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm ">{video?.commentCount}</span>
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <AiOutlineLike />
                    <span className="text-sm ">{video?.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineDislike />
                    <span className="text-sm ">({video?.dislikeCount})</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile View */}
            <div className="xl:hidden px-2">
              <VideoMobileCard video={video} />
            </div>
          </div>
        ));

      case 'Tweets':
        return userTweets?.map(tweet => (
          <div key={tweet._id}>
            {/* Desktop View */}
            <div className="hidden xl:block px-6">
              <div className="grid grid-cols-12 gap-4 py-4 items-center border-b border-[var(--secondary)] hover:bg-[var(--secondary)]">
                <div className="col-span-3 flex gap-3 group">
                  <div className="relative">
                    <div className="w-32 h-20 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {tweet.tweetImage ? (
                        <img
                          src={tweet.tweetImage}
                          alt="tweet thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white">No Image</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="group-hover:hidden text-sm font-medium ">
                      {tweet.content.length > 20
                        ? tweet.content.substring(0, 20) + '...'
                        : tweet.content}
                    </div>
                    <div className="hidden group-hover:block">
                      <div className="flex items-center gap-3 py-3">
                        <button
                          onClick={() =>
                            navigateDetails('tweet-details', tweet?._id)
                          }
                          className="p-2 rounded-full cursor-pointer"
                        >
                          <VscEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleTweetDelete(tweet?._id)}
                          className="p-2 rounded-full cursor-pointer"
                        >
                          <AiTwotoneDelete size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm ">
                    {tweet.tweetImage ? 'Image' : 'Text'}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm ">
                    {tweet?.isPublished ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="col-span-1">
                  <span className="text-sm ">
                    {format(new Date(tweet.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm ">{tweet?.views}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm ">{tweet?.commentCount}</span>
                </div>
                <div className="col-span-1 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <AiOutlineLike />
                    <span className="text-sm ">{tweet?.tweetLikeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineDislike />
                    <span className="text-sm ">
                      ({tweet?.tweetDislikeCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile View */}
            <div className="xl:hidden px-4">
              <TweetMobileCard tweet={tweet} />
            </div>
          </div>
        ));

      case 'Playlists':
        return userPlaylists?.map(playlist => (
          <div key={playlist?._id}>
            {/* Desktop View */}
            <div className="hidden xl:block px-6">
              <div className="grid grid-cols-12 gap-4 py-4 items-center border-b border-[var(--secondary)] hover:bg-[var(--secondary)]">
                <div className="col-span-3 flex gap-3 group">
                  <div className="relative">
                    <div className="relative w-32 h-20  rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={
                          playlist?.playlistImage ||
                          playlist?.videos[0]?.thumbnail
                        }
                        alt={playlist?.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <IoList className="w-3 h-3" />
                        {playlist?.videos.length}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium ">{playlist.name}</div>
                    <div className="text-sm group-hover:hidden">
                      {playlist.description
                        ? playlist.description.length > 20
                          ? playlist.description.substring(0, 20) + '...'
                          : playlist.description
                        : 'No Description'}
                    </div>
                    <div className="hidden group-hover:block">
                      <div className="flex items-center gap-3 py-3">
                        <button
                          onClick={() =>
                            navigateDetails('playlist-details', playlist?._id)
                          }
                          className=" p-2 rounded-full cursor-pointer"
                        >
                          <VscEdit size={20} />
                        </button>
                        <button
                          onClick={() => handlePlaylistDelete(playlist?._id)}
                          className=" p-2 rounded-full cursor-pointer"
                        >
                          <AiTwotoneDelete size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm ">playlist</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm ">
                    {playlist?.isPublished ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-sm ">
                    {format(new Date(playlist.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <span className="text-sm ">{playlist?.videos.length}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm ">{playlist?.totalViews}</span>
                </div>
              </div>
            </div>
            {/* Mobile View */}
            <div className="xl:hidden px-4">
              <PlaylistMobileCard playlist={playlist} />
            </div>
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 lg:px-6 py-4">
        <h1 className="text-xl lg:text-2xl font-medium ">Channel content</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 lg:px-6 py-4">
        <div className="border-b border-[var(--secondary)]">
          <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveContentTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                  activeContentTab === tab
                    ? 'border-[var(--foreground)] text-[var(--foreground)]'
                    : 'border-transparent text-[var(--muted)]  hover:text-[var(--foreground)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        {/* Table Headers */}
        <div className="px-6">
          <div className="grid grid-cols-12 gap-4 py-3 text-sm font-medium  border-b border-[var(--secondary)]">
            <div className="col-span-3">{activeContentTab}</div>
            {activeContentTab !== 'Videos' && (
              <div className="col-span-2">Type</div>
            )}
            <div className="col-span-2">Visibility</div>

            <div className="col-span-2 flex  gap-1">
              {activeContentTab !== 'Playlists' ? 'Date' : 'Last updated'}
              <ChevronDown size={12} />
            </div>
            {activeContentTab === 'Videos' && (
              <div className="col-span-1 text-center">Views</div>
            )}
            {activeContentTab !== 'Playlists' && (
              <div className="col-span-1 text-center">Comments</div>
            )}
            {activeContentTab !== 'Playlists' && (
              <div className="col-span-2">Likes & dislikes</div>
            )}
            {activeContentTab === 'Playlists' && (
              <div className="col-span-1 text-center">Video Count</div>
            )}
            {activeContentTab === 'Playlists' && (
              <div className="col-span-1 text-center">Total Views</div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">{randerRows()}</div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="py-4">{randerRows()}</div>
      </div>

      {isVideoUploadOpen && (
        <VideoUploadModal
          isSet={setVideoUploadOpen}
          uploadVideo={uploadVideo}
          uploadingVideo={uploadingVideo}
        />
      )}
      {isPlaylistOpen && <PlaylistAddModal setPlaylist={setPlaylist} />}
    </div>
  );
};

export default Content;
