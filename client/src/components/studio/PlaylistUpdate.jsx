import { useState } from 'react';
import { useUpdatePlaylist } from '../../hooks/playlist/useUpdatePlaylist';
import { useParams } from 'react-router';

const PlaylistUpdate = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { mutate: updatePlaylist, isPending: updatingPlaylist } =
    useUpdatePlaylist();

  const handleUpdate = () => {
    updatePlaylist({ formData, playlistId: id });
  };

  return (
    <div className="max-w-6xl mt-5 bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--secondary)]">
        <h1 className="text-xl font-medium">Playlist details</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpdate}
            className="px-8 py-2 text-sm font-medium bg-[var(--foreground)] text-[var(--background)] border border-transparent rounded-md cursor-pointer"
          >
            {updatingPlaylist ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title field */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title (required)
              </label>
              <input
                id="title"
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
              />
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add description"
                className="w-full h-48 px-3 py-2 border border-[var(--secondary)] rounded-md shadow-sm focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Right column - Settings */}
          <div className="space-y-6">
            {/* Visibility */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Visibility</label>
              <div className="relative">
                <select className="w-full px-3 py-2 bg-[var(--secondary)] border border-[var(--secondary)] rounded-md shadow-sm focus:outline-none appearance-none">
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaylistUpdate;
