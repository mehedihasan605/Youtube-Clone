import { HelpCircle, UploadIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const VideoUploadModal = ({ isSet, uploadVideo, uploadingVideo }) => {
  const [thumbnailFileName, setThumbnailFileName] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);

  const handleFileChangeThumbnail = e => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFileName(file);
    }
  };

  const handleFileChangeVideo = e => {
    const file = e.target.files[0];
    if (file) {
      setVideoFileName(file);
    }
  };

  const getShortFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const ext = name.includes('.') ? name.split('.').pop() : '';
    const base = name.substring(0, maxLength - (ext.length + 3)); // 3 for "..."
    return `${base}...${ext ? `.${ext}` : ''}`;
  };

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('thumbnail', thumbnailFileName);
    formData.append('video', videoFileName);

    uploadVideo(formData, {
      onSuccess: () => {
        reset();
        isSet(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--background)] text-[var(--foreground)] w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[var(--secondary)] sticky top-0  z-10">
          <h1 className="text-lg sm:text-xl font-medium">Upload videos</h1>
          <div>
            <button
              onClick={() => isSet(false)}
              className="p-1.5 sm:p-2 cursor-pointer rounded-full focus:outline-none focus:ring-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-3 sm:px-6 pt-4 sm:pt-8">
            <div className="w-full">
              <div className="mb-6 sm:mb-8">
                {/* Title Field */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor="title"
                      className="font-medium text-sm sm:text-base"
                    >
                      Title (required)
                    </label>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    {...register('title', { required: true })}
                    className="w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Description Field */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <label
                      htmlFor="description"
                      className="font-medium text-sm sm:text-base"
                    >
                      Description
                    </label>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    {...register('description', { required: true })}
                    placeholder="Tell viewers about your video (type @ to mention a channel)"
                    className="w-full h-24 sm:h-32 px-3 py-2 border border-[var(--secondary)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16">
                {/* Thumbnail Section */}
                <div className="mb-6 sm:mb-8 w-full sm:w-auto">
                  <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left">
                    Thumbnail
                  </h3>

                  <div className="flex justify-center sm:justify-start">
                    <label
                      htmlFor="file-thumbnail"
                      className="border-2 border-dashed border-[var(--secondary)] rounded-lg  cursor-pointer flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-64 h-20 sm:h-24"
                    >
                      <UploadIcon className="w-5 h-5 sm:w-6 sm:h-6 mb-2" />
                      <span className="text-xs sm:text-sm text-center">
                        {thumbnailFileName
                          ? getShortFileName(thumbnailFileName?.name)
                          : 'Upload file'}
                      </span>
                      <input
                        id="file-thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChangeThumbnail}
                      />
                    </label>
                  </div>
                </div>

                {/* Video Section */}
                <div className="mb-6 sm:mb-8 w-full sm:w-auto">
                  <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left">
                    Video
                  </h3>

                  <div className="flex justify-center sm:justify-start">
                    <label
                      htmlFor="file-video"
                      className="border-2 border-dashed border-[var(--secondary)] rounded-lg  cursor-pointer flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-64 h-20 sm:h-24"
                    >
                      <UploadIcon className="w-5 h-5 sm:w-6 sm:h-6 mb-2" />
                      <span className="text-xs sm:text-sm text-center">
                        {videoFileName
                          ? getShortFileName(videoFileName?.name)
                          : 'Upload file'}
                      </span>
                      <input
                        id="file-video"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileChangeVideo}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center px-3 sm:px-6 pb-4 sm:pb-8">
            <button
              type="submit"
              className="bg-[var(--foreground)] text-[var(--background)] cursor-pointer px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-[var(--primary)] hover:text-[var(--foregound)] transition-colors w-full sm:w-auto"
            >
              {uploadingVideo ? 'Uploading....' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VideoUploadModal;
