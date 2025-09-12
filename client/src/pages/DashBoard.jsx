import { MdTrendingUp, MdOpenInNew, MdMoreHoriz } from 'react-icons/md';
import VideoUploadModal from './../components/ui/modal/VideoUploadModal';
import PlaylistAddModal from './../components/ui/modal/PlaylistAddModal';
import { useLayoutContext } from '../hooks/context/useLayoutContext';
import { useGetChannelStats } from './../hooks/dashboard/useGetChannelStats';
import Loading from '../components/ui/loading/Loading';

const DashBoard = () => {
  const {
    setVideoUploadOpen,
    isVideoUploadOpen,
    uploadVideo,
    uploadingVideo,
    setPlaylist,
    isPlaylistOpen,
  } = useLayoutContext();

  const { data: channelStats, isLoading } = useGetChannelStats();
  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl lg:text-2xl font-medium">Channel dashboard</h1>
          <div className="flex items-center gap-2">
            <button className="p-2  rounded-full">
              <MdTrendingUp className="h-4 w-4" />
            </button>
            <button className="p-2  rounded-full">
              <MdMoreHoriz className="h-4 w-4" />
            </button>
            <button className="p-2  rounded-full">
              <MdOpenInNew className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Upload Video Section */}
          <div className="rounded-lg border border-[var(--secondary)] shadow-sm">
            <div className="p-4 lg:p-6 text-center">
              <div className="mb-4">
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-4 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-cyan-400 rounded-lg flex items-center justify-center relative">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-cyan-600 rounded"></div>
                    <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-4 h-4 lg:w-6 lg:h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 lg:w-3 lg:h-3 bg-cyan-700 rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-4 lg:w-4 lg:h-6 bg-cyan-500 rounded-b"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm mb-4 px-2">
                Want to see metrics on your recent video?
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Upload and publish a video to get started.
              </p>
              <button
                onClick={() => setVideoUploadOpen(!isVideoUploadOpen)}
                className="px-4 cursor-pointer py-2 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--primary)] rounded-lg font-medium text-sm lg:text-base"
              >
                Upload videos
              </button>
            </div>

            {isVideoUploadOpen && (
              <VideoUploadModal
                isSet={setVideoUploadOpen}
                uploadVideo={uploadVideo}
                uploadingVideo={uploadingVideo}
              />
            )}
          </div>

          {/* Channel Analytics */}
          <div className="rounded-lg border border-[var(--secondary)] shadow-sm">
            <div className="p-4 border-b border-[var(--secondary)]">
              <h3 className="text-base lg:text-lg font-medium">
                Channel analytics
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm mb-1">Current subscribers</div>
                <div className="text-2xl lg:text-3xl font-bold">
                  {channelStats?.totalSubscriber || 0}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Summary</div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Views</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {channelStats?.totalViews || 0}
                      </span>
                      <div className="w-4 h-4 ">—</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Likes</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {channelStats?.totalLikes || 0}
                      </span>
                      <div className="w-4 h-4 ">—</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Total videos</div>
                <div className="text-lg  mb-3 font-black">
                  {channelStats?.totalVideos || 0}
                </div>
              </div>
            </div>
          </div>

          {/* What's New */}
          <div className="rounded-lg border border-[var(--secondary)] shadow-sm md:col-span-2 xl:col-span-1">
            <div className="p-4 border-b border-[var(--secondary)]">
              <h3 className="text-base lg:text-lg font-medium">
                {"What's new in Studio"}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <a href="#" className="block text-sm hover:underline">
                  Increasing Shorts length
                </a>
                <a href="#" className="block text-sm hover:underline">
                  Expansion of channel permissions
                </a>
                <a href="#" className="block text-sm hover:underline">
                  Upcoming changes to Community Guidelines warnings
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 lg:mt-12 pt-6 border-t border-[var(--secondary)]">
          <div className="flex flex-wrap gap-4 lg:gap-6 text-sm ">
            <a href="#">Terms of use</a>
            <a href="#">Privacy policy</a>
            <a href="#">Policies & Safety</a>
          </div>
        </footer>
      </main>
      {isPlaylistOpen && <PlaylistAddModal setPlaylist={setPlaylist} />}
    </div>
  );
};

export default DashBoard;
