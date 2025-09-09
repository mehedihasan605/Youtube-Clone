import { useState, useEffect, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useUserPlaylists } from "../hooks/playlist/useUserPlaylists";
import { useCurrentUser } from "../hooks/user/useCurrentUser";
import { getUpdatedLabel } from "../utils/getUpdatedLabel";
import { IoList } from "react-icons/io5";
import { Link } from "react-router";

const options = [
  { label: "Recently Created", value: "createdAt" },
  { label: "Last video added", value: "updatedAt" },
];

const Playlists = () => {
  const [activeTab, setActiveTab] = useState(false);
  const [openDropDown, setDropDown] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedOption, setSelectedOption] = useState("Recently Created");
  const [isMobile, setIsMobile] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: userPlaylists } = useUserPlaylists(currentUser?._id, sortBy);
  const sortRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // sort dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  console.log(userPlaylists);

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setDropDown(false);
    setActiveTab(true);
    setSortBy(option.value);
  };

  return (
    <div className="min-h-screen bg-[--background] text-[var(--foreground)]">
      <div>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Header */}
          <div className="pt-16 sm:pt-20 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4 sm:mb-6">
              Playlists
            </h1>

            {/* Mobile Tabs */}
            {isMobile ? (
              <div className="space-y-3">
                <div className="relative">
                  <button
                    onClick={() => setDropDown(!openDropDown)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm rounded-xl border"
                  >
                    {selectedOption}
                    <BiChevronDown className="w-4 h-4" />
                  </button>

                  {openDropDown && (
                    <div className="absolute left-0 right-0 mt-2 rounded-md shadow-lg z-50 border">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleOptionClick(option)}
                          className={`py-3 px-4 text-sm w-full text-left ${selectedOption === option.label
                            ? "bg-[var(--foreground)]"
                            : ""
                            } hover:bg-[var(--secondary)] hover:text-[var(--foreground)] first:rounded-t-md last:rounded-b-md`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab(true)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors ${activeTab
                    ? "bg-black text-white"
                    : "bg-[#f2f2f2] text-black"
                    }`}
                >
                  Playlists
                </button>
              </div>
            ) : (
              /* Desktop Tabs */
              <div className="flex items-center gap-2">
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setDropDown(!openDropDown)}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-[var(--secondary)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                  >
                    {selectedOption}
                    <BiChevronDown className="w-4 h-4" />
                  </button>

                  {openDropDown && (
                    <div className="bg-[var(--background)] absolute left-0 mt-2 w-56 rounded-md shadow-lg z-50 border">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleOptionClick(option)}
                          className={`py-3 px-4 text-sm w-full text-left ${selectedOption === option.label
                            ? "bg-[var(--secondary)]"
                            : ""
                            } hover:bg-[var(--secondary)] first:rounded-t-md last:rounded-b-md`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab(true)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab
                    ? "bg-[var(--foreground)] text-[var(--background)] hover:bg-gray-800"
                    : "bg-[var(--secondary)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                    }`}
                >
                  Playlists
                </button>
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {userPlaylists &&
              userPlaylists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className="group"
                >
                  <div className="rounded-lg overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden">
                      <img
                        src={playlist?.videos[0]?.thumbnail}
                        alt={playlist?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />

                      {/* Video count overlay */}
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <IoList className="w-3 h-3" />
                        {playlist?.videos?.length} videos
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm sm:text-base mb-1  transition-colors">
                        {playlist.name}
                      </h3>

                      <div className="flex items-center gap-1 text-xs  mb-2">
                        <span>
                          {playlist?.isPublished ? "Public" : "Private"}
                        </span>
                        <span>•</span>
                        <span>Playlist</span>
                      </div>

                      <div className="text-xs mb-2">
                        {playlist && getUpdatedLabel(playlist.updatedAt)}
                      </div>

                      <button className="text-xs font-semibold cursor-pointer transition-colors">
                        View full playlist
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          {/* Empty State */}
          {userPlaylists && userPlaylists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <IoList className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No playlists yet
              </h3>
              <p className="text-gray-500">
                Create your first playlist to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlists;
