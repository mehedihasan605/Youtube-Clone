import { useState } from "react";
import PlaylistDetailsLayout from "../components/shared/PlaylistDetailsLayout";
import { useGetWatchlaterVideos } from "../hooks/videos/useGetWatchlaterVideos";
import { useRemoveWatchlater } from "../hooks/videos/useRemoveWatchlater";
import { useLayoutContext } from "../hooks/context/useLayoutContext";
import LogoutPage from "./LogoutPage";

const WatchLater = () => {
  const { sidebarOpen, currentUser } = useLayoutContext();
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState("newest");
  const { data: watchlaterVideos, isLoading } = useGetWatchlaterVideos(sort);
  const { mutate: watchlaterRemove } = useRemoveWatchlater();



  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {
        currentUser ? (<div>

          <PlaylistDetailsLayout
            videos={watchlaterVideos}
            loading={isLoading}
            onSortChange={setSort}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            onClick={watchlaterRemove}
            sidebarOpen={sidebarOpen}
          />


        </div>) : (<LogoutPage title={'See Your WatchLater Videos please SignIn'} message={'WatchLater Videos isnt viewable when signed out.'} />)
      }
    </div>
  );
};

export default WatchLater;
