import { useState } from 'react';
import { useLocation } from 'react-router';
import { useGetAllVideo } from '../videos/useGetAllVideo';
import { useGetSubscriptionVideos } from '../videos/useGetSubscriptionVideos';
import { LayoutContext } from './useLayoutContext';
import { useUploadVideo } from '../videos/useUploadVideo';
import { useCurrentUser } from '../user/useCurrentUser';

export const LayoutProvider = ({ children }) => {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(false);
  const [useSidebarVideoDetails, setUseSidebarVideoDetails] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [showSidebarVideoDetails, setShowSidebarVideoDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // states
  const [studioSidebarOpen, setStudioSidebarOpen] = useState(false);
  const [isVideoUploadOpen, setVideoUploadOpen] = useState(false);
  const [isPlaylistOpen, setPlaylist] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const shouldHideSidebar = location.pathname.startsWith('/video/');

  // api calls
  const {
    data: videosData,
    isLoading: videosLoading,
    hasNextPage: videoHasNextPage,
    fetchNextPage: videoFetchNextPage,
    status: videoStatus,
    isFetchingNextPage: videoIsFetchingNextPage,
  } = useGetAllVideo({ query: searchQuery });
  // Flatten pages for easier consumption
  const videos = videosData?.pages.flatMap(page => page.videos) || [];
  const {
    data: subscriptionFeed,
    isLoading: subscriptionVideosLoading,
    hasNextPage: subscriptionHasNextPage,
    fetchNextPage: subscriptionFetchNextPage,
    status: subscriptionStatus,
    isFetchingNextPage: subscriptionIsFetchingNextPage,
  } = useGetSubscriptionVideos({ query: searchQuery });
  const subscriptionVideos =
    subscriptionFeed?.pages.flatMap(page => page.videos) || [];

  const { mutate: uploadVideo, isPending: uploadingVideo } = useUploadVideo();
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  return (
    <LayoutContext.Provider
      value={{
        currentUser,
        currentUserLoading,
        openLogin,
        setOpenLogin,
        sidebarOpen,
        setSidebarOpen,
        hideSidebar,
        setHideSidebar,
        useSidebarVideoDetails,
        setUseSidebarVideoDetails,
        showSidebarVideoDetails,
        setShowSidebarVideoDetails,
        shouldHideSidebar,
        isOpen,
        setIsOpen,
        isOpenCreate,
        setIsOpenCreate,
        searchQuery,
        setSearchQuery,
        videos,
        videosLoading,
        videoHasNextPage,
        videoFetchNextPage,
        videoStatus,
        videoIsFetchingNextPage,
        subscriptionVideos,
        subscriptionVideosLoading,
        subscriptionHasNextPage,
        subscriptionFetchNextPage,
        subscriptionStatus,
        subscriptionIsFetchingNextPage,
        studioSidebarOpen,
        setStudioSidebarOpen,
        isVideoUploadOpen,
        setVideoUploadOpen,
        isPlaylistOpen,
        setPlaylist,
        isMobile,
        setIsMobile,
        uploadVideo,
        uploadingVideo,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
