import React, { useState } from 'react';
// Import icons from the react-icons library
import { IoClose } from 'react-icons/io5';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { useChannelDashboardVideos } from '../../../hooks/dashboard/useChannelDashboardVideos';
import { useCreatePlaylists } from '../../../hooks/playlist/useCreatePlaylists';
import { useAddMultipleVideo } from '../../../hooks/playlist/useAddMultipleVideo';
import toast from 'react-hot-toast';

// Component for the "Add Videos" Modal
const AddVideosModal = ({ onClose, selectedVideos, setSelectedVideos }) => {
  const [search, setSearch] = useState('');
  const { data: yourVideos } = useChannelDashboardVideos(search);

  // Toggles the selection of a video
  const toggleVideoSelection = video => {
    setSelectedVideos(prev =>
      prev.find(v => v._id === video._id)
        ? prev.filter(v => v._id !== video._id)
        : [...prev, video]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-2xl font-normal">Add videos</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full focus:outline-none"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Search and video list */}
            <div>
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-5 w-5" />
                </span>
                <input
                  type="search"
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Your videos"
                  className="block w-full pl-10 pr-3 py-2 border-b-2 border-[var(--secondary)] sm:text-sm"
                />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="text-xs px-2">Video title</div>
                {yourVideos &&
                  yourVideos.map(video => (
                    <div
                      key={video._id}
                      className="flex items-center p-2 rounded-md hover:bg-[var(--secondary)]"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 border-[var(--secondary)] rounded"
                        checked={selectedVideos.some(v => v._id === video._id)}
                        onChange={() => toggleVideoSelection(video)}
                      />
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-14 object-cover mx-4 rounded"
                      />
                      <span className="text-sm">{video.title}</span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Right side: Videos to add */}
            <div className="border-l border-[var(--secondary)] pl-6">
              <h3 className="text-sm font-medium mb-2">Videos to add</h3>
              <div className="space-y-2">
                {selectedVideos.length > 0 ? (
                  selectedVideos.map(video => (
                    <div key={video._id} className="flex items-center text-sm">
                      <span>{video.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm">No videos selected.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 flex justify-end items-center rounded-b-xl space-x-3">
          <button
            onClick={onClose}
            disabled={selectedVideos.length === 0}
            type="button"
            className={`py-2 px-6 border border-transparent shadow-sm text-sm font-medium   rounded-full  focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              selectedVideos.length === 0
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'text-[var(--background)] bg-[var(--foreground)] cursor-pointer '
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function PlaylistAddModal({ setPlaylist }) {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');
  console.log(selectedVideos);

  const { mutateAsync: createPlaylist } = useCreatePlaylists();
  const { mutate: addVideoOnPlaylist } = useAddMultipleVideo();

  // State to control the visibility of the "Add Videos" modal
  const [isAddVideosModalOpen, setAddVideosModalOpen] = useState(false);

  const handleCreate = async () => {
    const payload = {
      name: title,
      isPublished: visibility,
      description: description,
    };

    try {
      const res = await createPlaylist(payload); // mutateAsync auto handled
      const playlistId = res?.data?._id;

      const addVideoData = {
        playlistId: playlistId,
        videos: selectedVideos.map(video => video._id),
      };

      addVideoOnPlaylist(addVideoData);

      setTitle('');
      setDescription('');
      setPlaylist(false);
    } catch (error) {
      console.error('Error creating playlist or adding video:', error);
      toast.error('Something went wrong');
    }
  };
  const isCreateDisabled = !title.trim();

  return (
    // Main container to center the modal on the page
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* The Modal Dialog */}
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-normal">Create a new playlist</h2>
            <button
              onClick={() => setPlaylist(false)}
              className="p-1 rounded-full cursor-pointer"
            >
              {/* Using IoClose from react-icons */}
              <IoClose className="h-6 w-6" />
            </button>
          </div>
          <div className="border-t border-[var(--secondary)] mt-4 mb-8"></div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Title Input */}
            <div
              className="relative border border-[var(--secondary)] rounded-md px-3 py-3 shadow-sm cursor-text"
              onClick={() => document.getElementById('title')?.focus()}
            >
              <label
                htmlFor="title"
                className="absolute -top-2 left-2 -mt-px inline-block px-1  text-xs font-medium"
              >
                Title (required)
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="block w-full border-0 p-0 placeholder-gray-500 focus:ring-0 sm:text-sm outline-none py-2"
                placeholder="Add title"
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Description Input */}
            <div className="relative border border-[var(--secondary)] rounded-md px-3 py-2 shadow-sm">
              <label
                htmlFor="description"
                className="absolute -top-2 left-2 -mt-px inline-block px-1 text-xs font-medium"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className="block w-full border-0 p-0 placeholder-gray-500 focus:ring-0 sm:text-sm outline-none resize-none"
                placeholder="Add description"
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Visibility and Sort Order Section */}
            <div>
              <h3 className="text-base font-medium mb-2">
                Visibility and sort order
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visibility Dropdown */}
                <div className="relative">
                  <label
                    htmlFor="visibility"
                    className="block text-sm font-medium mb-1"
                  >
                    Visibility
                  </label>
                  <div className="relative">
                    <select
                      id="visibility"
                      name="visibility"
                      onChange={e => setVisibility(e.target.value)}
                      className="appearance-none block w-full bg-[var(--background)] border border-[var(--secondary)] rounded-md py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                      defaultValue="Public"
                    >
                      <option>Public</option>
                      <option>Private</option>
                      <option>Unlisted</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      {/* Using FiChevronDown from react-icons */}
                      <FiChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Section */}
            <div>
              <h3 className="text-base font-medium">Videos</h3>
              <p className="text-sm mb-3">
                Choose existing videos to add to your playlist.
              </p>
              <button
                onClick={() => setAddVideosModalOpen(true)}
                type="button"
                className="inline-flex items-center px-4 py-2  text-sm font-medium rounded-full cursor-pointer bg-[var(--foreground)] text-[var(--background)]"
              >
                Add videos
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 flex justify-end rounded-b-xl">
          <button
            onClick={handleCreate}
            type="button"
            disabled={isCreateDisabled}
            className={`inline-flex justify-center py-2 px-6 border border-transparent rounded-full shadow-sm text-sm font-medium  ${
              isCreateDisabled
                ? 'bg-[var(--foreground)] text-[var(--muted)] cursor-not-allowed'
                : 'cursor-pointer bg-[var(--foreground)] text-[var(--background)]'
            }`}
          >
            Create
          </button>
        </div>
      </div>
      {/* Render the "Add Videos" modal if it's open */}
      {isAddVideosModalOpen && (
        <AddVideosModal
          onClose={() => setAddVideosModalOpen(false)}
          setSelectedVideos={setSelectedVideos}
          selectedVideos={selectedVideos}
        />
      )}
    </div>
  );
}
