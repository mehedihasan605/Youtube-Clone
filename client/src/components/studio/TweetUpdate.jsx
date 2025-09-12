import { useState } from 'react';
import {
  HiOutlineDotsHorizontal,
  HiOutlineGlobe,
  HiOutlineClipboardCopy,
  HiPhotograph,
  HiCheck,
} from 'react-icons/hi';
import { useUpdateTweet } from '../../hooks/tweet/useUpdateTweet';
import { Link, useParams } from 'react-router';
import { useGetTweetById } from '../../hooks/tweet/useGetTweetById';

const TweetUpdate = () => {
  const { id } = useParams();
  const [textContent, setTextContent] = useState('');
  const [copied, setCopied] = useState(false);

  const { mutate: updateTweet, isPending: isUpdating } = useUpdateTweet(id);
  const { data: tweet } = useGetTweetById(id);
  console.log(tweet);
  const link = `http://localhost:5173/tweet/${id}`;

  console.log(textContent);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUpdate = () => {
    updateTweet(textContent);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl  bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-[var(--secondary)]">
          <h1 className="text-lg sm:text-xl font-medium">Tweets details</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="px-5 sm:px-8 py-1.5 text-sm font-medium bg-[var(--foreground)] text-[var(--background)] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Text (required)
              </label>
              <textarea
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 border border-[var(--secondary)] rounded-md placeholder-gray-500 focus:outline-none resize-none"
                placeholder="Enter your text here..."
              />
            </div>

            {/* Image Section */}
            {tweet?.tweetImage && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Image</label>
                <div className="relative">
                  <div className="border-2 border-[var(--secondary)] border-dashed rounded-lg p-2 sm:p-4">
                    <img
                      src={tweet.tweetImage}
                      alt="Cricket player"
                      className="w-full max-w-full sm:max-w-sm rounded-lg shadow-sm object-cover"
                    />
                    {/* Top overlay */}
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6  bg-opacity-60  text-xs px-2 py-1 rounded-full">
                      1/1
                    </div>
                    {/* Bottom overlay */}
                    <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 p-1.5 sm:p-2 rounded">
                      <HiPhotograph className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[var(--secondary)] p-4 sm:p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1">Likes</p>
                <p className="text-lg font-medium">{tweet?.tweetLikeCount}</p>
              </div>
              <div>
                <p className="text-sm mb-1">Comments</p>
                <p className="text-lg font-medium">{tweet?.commentCount}</p>
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3">
              <p className="text-sm">Type</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center rounded text-xs font-medium">
                  Aa
                </div>
                <span className="text-sm">
                  {tweet?.tweetImage === null ? 'Text' : 'Image'}
                </span>
              </div>
            </div>

            {/* Link */}
            <div className="space-y-3">
              <p className="text-sm">Link</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
                <Link
                  to={link}
                  className="text-sm text-blue-600 truncate flex-1 cursor-pointer"
                >
                  {link}
                </Link>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded cursor-pointer"
                >
                  {copied ? (
                    <HiCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <HiOutlineClipboardCopy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <p className="text-sm">Visibility</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
                <HiOutlineGlobe className="w-4 h-4" />
                <span className="text-sm">Public</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetUpdate;
