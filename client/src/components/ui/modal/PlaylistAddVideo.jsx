import React, { useEffect, useState } from "react";
import { IoClose, IoLockClosedOutline, IoAdd } from "react-icons/io5";
import { CiUnlock } from "react-icons/ci";
// Data for the playlists. In a real app, this would likely come from an API.

const PlaylistAddVideo = ({
  isOpen,
  onClose,
  onNewPlaylistClick,
  userPlaylists,
  addVideoPlaylist,
  removeVideoPlaylist,
  videoId,
}) => {



  const [checkedState, setCheckedState] = useState([]);

  useEffect(() => {
    if (userPlaylists && videoId) {
      setCheckedState(
        userPlaylists.map((playlist) => playlist.video.includes(videoId))
      );
    }

  }, [userPlaylists, videoId]);




  const handleCheckboxChange = async (position) => {
    const playlistId = userPlaylists[position]._id;
    const wasChecked = checkedState[position];

    try {
      if (wasChecked) {
        await removeVideoPlaylist({ videoId, playlistId });
        console.log("Removed from playlist:", playlistId);
      } else {
        await addVideoPlaylist({ videoId, playlistId });
        console.log("Added to playlist:", playlistId);
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
    }

    // Update checked state
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  return (
    // Modal Overlay: covers the whole screen and centers the content
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* Modal Content */}
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-lg p-5 m-4 w-full max-w-xs font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Save video to...
          </h2>
          <button
            onClick={onClose} // Use the prop here
            className="cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Playlist Items List */}
        <div className="space-y-1 mb-5">
          {userPlaylists.map((playlist, index) => (
            <label
              key={playlist._id}
              htmlFor={`playlist-${playlist._id}`}
              className="flex items-center p-2 rounded-md hover:bg-[var(--secondary)] cursor-pointer"
            >
              <input
                type="checkbox"
                id={`playlist-${playlist._id}`}
                checked={checkedState[index] ?? false}
                onChange={() => handleCheckboxChange(index)}
                className="h-6 w-6 rounded border-[var(--secondary)] text-black focus:ring-black cursor-pointer"
              />
              <span className="ml-4 flex-grow text-base">
                {playlist.name}
              </span>
              {playlist?.isPublished === "Public" ? (
                <CiUnlock size={20} />
              ) : (
                <IoLockClosedOutline size={20} />
              )}
            </label>
          ))}
        </div>

        {/* New Playlist Button */}
        <button
          onClick={() => {
            onNewPlaylistClick(videoId);
            onClose();
          }}
          className="w-full flex items-center p-3 bg-[var(--foreground)] rounded-lg text-[var(--background)] transition-colors cursor-pointer"
        >
          <IoAdd size={22} className="mr-3" />
          <span className="text-base font-medium">New playlist</span>
        </button>
      </div>
    </div>
  );
};

export default PlaylistAddVideo;
