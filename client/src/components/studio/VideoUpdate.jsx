import { useNavigate, useParams } from 'react-router';
import { useGetVideoId } from '../../hooks/videos/useGetVideoId';
import Loading from '../../components/ui/loading/Loading';
import { useUpdateVideo } from '../../hooks/videos/useUpdateVideo';
import { useState } from 'react';

const VideoUpdate = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    title: '',
    description: '',
    thumbnail: '',
  });

  const navigate = useNavigate();
  const { mutate: updateVideo, isPending: updateVideoLoading } =
    useUpdateVideo(id);

  const navigateVideoDetails = id => {
    navigate(`/video/${id}`);
  };

  const { data: video, isLoading } = useGetVideoId(id);
  

  const shortenUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;

    const extension = url.split('.').pop(); // mp4, jpg etc.
    const start = url.slice(0, 50);
    return `${start}...${extension}`;
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('thumbnail', data.thumbnail[0]);

    updateVideo(formData);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl bg-[var(--background)] text-[var(--foreground)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Video details</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpdate}
            className="px-8 py-2 cursor-pointer bg-[var(--foreground)] text-[var(--background)] rounded-md transition-colors"
          >
            {updateVideoLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Title</label>
            </div>
            <input
              onChange={e => setData({ ...data, title: e.target.value })}
              type="text"
              className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:outline-none"
              placeholder="Add a title that describes your video"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Description</label>
            </div>
            <textarea
              onChange={e => setData({ ...data, description: e.target.value })}
              placeholder="Tell viewers about your video (type @ to mention a channel)"
              className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:outline-none focus:ring-2 min-h-[200px] resize-none"
            />
          </div>

          {/* Thumbnail Section */}
          {/* Upload File */}
          <label className="p-4 border-2 border-dashed border-[var(--secondary)] hover:border-gray-300 cursor-pointer transition-colors rounded-lg flex flex-col items-center justify-center h-30 space-y-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-center">
              <div className="text-xs font-medium">Upload file</div>

              {/* Show File Name */}
              {data?.thumbnail && data.thumbnail.length > 0 && (
                <p className="text-xs mt-2">
                  {data.thumbnail[0].name.length > 15
                    ? data.thumbnail[0].name.substring(0, 15) + '...'
                    : data.thumbnail[0].name}
                </p>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              onChange={e => setData({ ...data, thumbnail: e.target.files })}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        {/* Right Column - Video Preview */}
        <div className="space-y-6">
          {/* Video Player */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <video
                controls
                autoPlay={false}
                muted
                loop
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <source src={video?.videoFile} type="video/mp4"></source>
              </video>
            </div>
          </div>

          {/* Video Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm">Video link</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => navigateVideoDetails(video?._id)}
                  className="text-sm text-blue-600 cursor-pointer"
                >
                  http://localhost:5173/video/{video?._id}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm">Filename</label>
              <div className="text-sm mt-1">{shortenUrl(video?.videoFile)}</div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visibility</label>
            <div className="relative">
              <select className="w-full px-3 py-2 pl-10 border border-[var(--secondary)] rounded-md focus:outline-none appearance-none bg-[var(--secondary)]">
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoUpdate;
