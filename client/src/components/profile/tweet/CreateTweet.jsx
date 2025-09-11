import { Image } from "lucide-react";
import { useState } from "react";

const CreateTweet = ({ currentUser, createTweet }) => {
  const [postText, setPostText] = useState("");
    const [imgFile, setImgFile] = useState(null);
    

  const handleTweetPost = async () => {
    const formData = new FormData();
    formData.append("content", postText);
    if (imgFile) {
      formData.append("tweetImage", imgFile); // এখানে "tweetImage" server এর expected field name
    }

    await createTweet(formData); // এখন এটা req.body না, req.files বা req.formData হতে হবে

    setPostText("");
    setImgFile(null);
  };


  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border border-[var(--secondary)] shadow-sm">
      <div className="p-6">
        {/* Header with profile and visibility */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img
                src={currentUser?.avatar}
                className="object-cover object-center w-full h-full rounded-full"
                alt=""
              />
            </div>
            <span className="font-medium">
              {currentUser?.fullName}
            </span>
          </div>
          <div className="text-sm">
            <span className="mr-2">Visibility:</span>
            <span className="text-orange-600 font-medium">Public</span>
          </div>
        </div>

        {/* Post prompt */}

        <div className="mb-6">
          <input
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Post an update to your fans"
            className="text-base outline-none w-full bg-transparent"
          />
        </div>

        {/* Content type buttons and post button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center  gap-4">
            <label className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors cursor-pointer">
              <Image className="w-4 h-4" />
              <span>Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImgFile(e.target.files[0])}
              />
            </label>
            {imgFile && (
              <p className="text-sm mt-2">
                Selected: {imgFile.name}
              </p>
            )}
          </div>

          <button
            onClick={handleTweetPost}
            disabled={!postText}
            className={`px-8 py-2 rounded-md flex items-center gap-1 transition-colors ${
              postText
              ? "cursor-pointer bg-[var(--foreground)] text-[var(--background)] "
              : "bg-[var(--background)] text-[var(--muted)] cursor-not-allowed"
            }`}
          >
            <span>Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateTweet;
