import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoChevronDown } from "react-icons/io5";

const NewPlaylist = ({
  isOpen,
  onClose,
  createPlaylist,
  createPlaylistLoading,
  addVideoPlaylist,
  videoId
}) => {
  // State for the form fields
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("Private");


  // Don't render if not open
  if (!isOpen) return null;

  const handleCreate = async () => {
    const payload = {
      name: title,
      isPublished: visibility,
    };

    try {
      const res = await createPlaylist(payload); // mutateAsync auto handled
      const playlistId = res?.data?._id;

      await addVideoPlaylist({ videoId, playlistId });

      setTitle("");
      onClose();
    } catch (error) {
      console.error("Error creating playlist or adding video:", error);
      toast.error("Something went wrong");
    }
  };


  // Disable create button if title is empty
  const isCreateDisabled = title.trim() === "";

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      {/* Modal Content */}
      <div className="bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-lg p-6 m-4 w-full max-w-xs font-sans">
        {/* Header */}
        <h2 className="text-xl font-bold mb-6">New playlist</h2>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Title Input */}
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Choose a title"
              className="w-full px-4 py-3 border border-[var(--secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Visibility Dropdown */}
          <div className="relative">
            <label className="absolute top-1 left-4 text-xs">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full pl-4 pr-10 pt-6 pb-2 appearance-none border border-[var(--secondary)]  rounded-lg bg-[var(--background)]"
            >
              <option>Private</option>
              <option>Public</option>
            </select>
            <IoChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center mt-8 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full  font-semibold hover:bg-[var(--secondary)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreateDisabled}
            className={`px-6 py-2 rounded-full font-semibold  ${isCreateDisabled
                ? "bg-[var(--muted)] text-[var(--secondary)] cursor-not-allowed"
                : "bg-[var(--foreground)] text-[var(--background)] cursor-pointer"
              }`}
          >
            {createPlaylistLoading ? "Creating...." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPlaylist;
