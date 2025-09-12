import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCurrentUser } from './../hooks/user/useCurrentUser';
import { useUserProfileUpdate } from './../hooks/user/useUserProfileUpdate';
import VideoUploadModal from '../components/ui/modal/VideoUploadModal';
import { useLayoutContext } from '../hooks/context/useLayoutContext';
import PlaylistAddModal from '../components/ui/modal/PlaylistAddModal';

const Customization = () => {
  const {
    setVideoUploadOpen,
    isVideoUploadOpen,
    uploadVideo,
    uploadingVideo,
    setPlaylist,
    isPlaylistOpen,
  } = useLayoutContext();

  const { data: currentUser } = useCurrentUser();
  const { mutate: updateUserProfile, isPending } = useUserProfileUpdate();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  // single state for all form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    avatar: null,
    coverImage: null,
  });

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    // 2 seconds পর আবার false করে দিবে
    setTimeout(() => setCopied(false), 2000);
  };

  // generic handler for text & file inputs
  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // form submit function (example)
  const handleSubmit = async () => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    updateUserProfile(data, {
      onSuccess() {
        setFormData({
          name: '',
          description: '',
          email: '',
          avatar: null,
          coverImage: null,
        });
      },
    });
  };

  const navigateChannel = () => {
    navigate(`/channal/${currentUser?.userName}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[var(--secondary)] bg-[var(--background)] px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <h1 className="text-xl lg:text-2xl font-medium">
              Channel customization
            </h1>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <button
              onClick={navigateChannel}
              className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-[var(--background)]  cursor-pointer bg-[var(--foreground)] rounded-full"
            >
              View channel
            </button>

            <button
              disabled={
                !formData.name &&
                !formData.description &&
                !formData.email &&
                !formData.avatar &&
                !formData.coverImage
              }
              onClick={handleSubmit}
              className={`px-4 lg:px-6 py-2 text-xs lg:text-sm font-medium rounded-full  transition-colors
                ${
                  formData.name ||
                  formData.description ||
                  formData.email ||
                  formData.avatar ||
                  formData.coverImage
                    ? 'bg-[var(--foreground)] text-[var(--background)] cursor-pointer'
                    : 'bg-[var(--muted)] text-gray-300 cursor-not-allowed'
                }`}
            >
              {isPending ? 'Updating...' : ' Publish'}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl px-4 lg:px-6 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Banner Image */}
        <div className="space-y-4 p-4 lg:p-6 rounded-lg border border-[var(--secondary)] bg-[var(--background)]">
          <div>
            <h2 className="text-lg font-medium mb-1">Banner image</h2>
            <p className="text-sm">
              This image will appear across the top of your channel
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6 gap-6">
            {formData.coverImage ? (
              <div className="w-32 h-20 lg:w-40 lg:h-24 lg:mx-0 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xl lg:text-2xl font-medium overflow-hidden flex-shrink-0">
                <img
                  src={URL.createObjectURL(formData.coverImage)}
                  alt="Banner"
                  className="w-full h-full object-fit"
                />
              </div>
            ) : (
              <div className="relative w-full lg:w-auto">
                {/* Device mockups */}
                <div className="relative w-32 h-20 lg:w-40 lg:h-24 mx-auto lg:mx-0">
                  {/* Desktop */}
                  <div className="absolute inset-0 bg-red-500 rounded-lg border-2 lg:border-4 border-gray-800">
                    <div className="w-full h-full bg-red-500 rounded"></div>
                  </div>
                  {/* Tablet */}
                  <div className="absolute top-2 lg:top-4 left-16 lg:left-20 w-12 h-8 lg:w-16 lg:h-12 bg-white border border-gray-800 lg:border-2 rounded">
                    <div className="w-full h-full bg-red-500 rounded-sm"></div>
                  </div>
                  {/* Mobile */}
                  <div className="absolute top-3 lg:top-6 left-22 lg:left-28 w-6 h-8 lg:w-8 lg:h-10 bg-gray-800 rounded-sm">
                    <div className="w-full h-4 lg:h-6 bg-red-500 rounded-sm mt-1"></div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-start space-x-1">
                <p className="text-sm">
                  For the best results on all devices, use an image that's at
                  least 2048 x 1152 pixels and 6MB or less.
                </p>
              </div>

              <label
                htmlFor="banner-upload"
                className="px-4 lg:px-6 py-2 text-sm font-medium bg-[var(--foreground)] text-[var(--background)] rounded-full cursor-pointer inline-block"
              >
                Upload
                <input
                  type="file"
                  name="coverImage"
                  id="banner-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Picture */}
        <div className="space-y-4  p-4 lg:p-6 rounded-lg border border-[var(--secondary)] bg-[var(--background)]">
          <div>
            <h2 className="text-lg font-medium mb-1">Picture</h2>
            <p className="text-sm">
              Your profile picture will appear where your channel is presented
              on YouTube, like next to your videos and comments
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gray-800 flex items-center justify-center text-white text-xl lg:text-2xl font-medium overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={
                  formData.avatar
                    ? URL.createObjectURL(formData.avatar)
                    : currentUser?.avatar
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-start space-x-1">
                <p className="text-sm">
                  It's recommended to use a picture that's at least 98 x 98
                  pixels and 4MB or less. Use a PNG or GIF (no animations) file.
                  Make sure your picture follows the YouTube Community
                  Guidelines.
                </p>
                {/* svg */}
              </div>

              <div className="flex space-x-2">
                <label htmlFor="fileInput">
                  <input
                    type="file"
                    id="fileInput"
                    name="avatar"
                    accept="image/png, image/gif"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <div className="px-4 lg:px-6 py-2 text-sm font-medium bg-[var(--foreground)] text-[var(--background)] rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                    Change
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-4  p-4 lg:p-6 rounded-lg border border-[var(--secondary)]">
          <div>
            <h2 className="text-lg font-medium mb-1">Name</h2>
            <div className="flex items-start space-x-1">
              <p className="text-sm">
                Choose a channel name that represents you and your content.
                Changes made to your name and picture are visible only on
                YouTube and not other Google services. You can change your name
                twice in 14 days.
              </p>
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Update channel name"
            className="w-full max-w-md px-3 py-2 border border-[var(--secondary)] rounded-md shadow-sm focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-4  p-4 lg:p-6 rounded-lg border border-[var(--secondary)]">
          <h2 className="text-lg font-medium">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places."
            rows={4}
            className="w-full max-w-2xl px-3 py-2 border border-[var(--secondary)] rounded-md shadow-sm focus:outline-none resize-none"
          />
        </div>

        {/* Channel URL */}
        <div className="space-y-4  p-4 lg:p-6 rounded-lg border border-[var(--secondary)]">
          <div>
            <h2 className="text-lg font-medium mb-1">Channel URL</h2>
            <div className="flex items-start space-x-1">
              <p className="text-sm">
                This is the standard web address for your channel. It includes
                your unique channel ID, which is the numbers and letters at the
                end of the URL.
              </p>
              <svg
                className="w-4 h-4  mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 max-w-2xl">
            <input
              type="text"
              value={`https://www.youtube.com/channal/${currentUser?.userName}`}
              readOnly
              className="flex-1 px-3 py-2  border border-[var(--secondary)] rounded-md  text-sm min-w-0"
            />
            <button
              onClick={() =>
                copyToClipboard(
                  `https://www.youtube.com/channal/${currentUser?.userName}`
                )
              }
              className="px-3 py-2 bg-[var(--foreground)] text-[var(--background)] border border-gray-300 rounded-md focus:outline-none outline-none cursor-pointer flex-shrink-0"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4  p-4 lg:p-6 rounded-lg border border-[var(--secondary)]">
          <div>
            <h2 className="text-lg font-medium mb-1">Mail Update</h2>
            <p className="text-sm">
              Let people know how to contact you with business inquiries. The
              email address you enter may appear in the about section of your
              channel and be visible to viewers.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full max-w-md px-3 py-2 border border-[var(--secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
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
export default Customization;
