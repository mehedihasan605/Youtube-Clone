import React, { useEffect, useState } from 'react';
import VideoCard from './VideoCard';

const ChannalVideos = ({ latest, oldest, populer }) => {
    const [activeVideoSort, setActiveVideoSort] = useState(
      () => localStorage.getItem("activeVideoSort") || "Latest"
    );
    
      const [feed, setFeed] = useState([]);
    
     
      useEffect(() => {
        let selectedFeed = [];

        if (activeVideoSort === "Latest") selectedFeed = latest;
        else if (activeVideoSort === "Popular") selectedFeed = populer;
        else if (activeVideoSort === "Oldest") selectedFeed = oldest;

        setFeed(selectedFeed);
      }, [activeVideoSort, latest, populer, oldest]);
    
     
      const handleButtonClick = (buttonName) => {
        setActiveVideoSort(buttonName);
        localStorage.setItem("activeVideoSort", buttonName);
      };
    
  return (
    <div>
      {/* Sorting Buttons */}
      <div className="flex items-center">
        <div className="flex space-x-2 mb-4 rounded-xl">
          {["Latest", "Popular", "Oldest"].map((label) => (
            <button
              key={label}
              className={`
                px-4 py-2 text-sm cursor-pointer rounded-lg font-semibold transition-colors duration-200 ease-in-out
                ${
                  activeVideoSort === label
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                }
                focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
              `}
              onClick={() => handleButtonClick(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {feed && feed.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default ChannalVideos;