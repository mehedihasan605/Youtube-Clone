import PlaylistDetailsLayout from "../components/shared/PlaylistDetailsLayout";
import { useGetLikedVideos } from "../hooks/like/useGetLikedVideos";
import { useToggleVideoLike } from "./../hooks/like/useToggleVideoLike";
import { useLayoutContext } from "../hooks/context/useLayoutContext";
import LogoutPage from './LogoutPage';

const LikedVideos = () => {
  const { sidebarOpen, currentUser } = useLayoutContext()
  const { data: likedVideos, isLoading } = useGetLikedVideos();
  const { mutate: videoLikeRemove } = useToggleVideoLike();


  return (
    <div className="min-h-screen bg-background">
      {currentUser ? <div>
        <PlaylistDetailsLayout
          videos={likedVideos}
          loading={isLoading}
          onClick={videoLikeRemove}
          sidebarOpen={sidebarOpen}
        />
      </div> : <LogoutPage title={'See Your LikedVideos please SignIn'} message={'LikedVideos Videos isnt viewable when signed out.'} />}
    </div>
  );
};

export default LikedVideos;
