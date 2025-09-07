
import { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMic,
  FiBell,
  FiVideo,
  FiPlay,
} from "react-icons/fi";
import { HiOutlineBars3 } from "react-icons/hi2";
import { RiVideoAiLine } from "react-icons/ri";
import { IoCreateOutline } from "react-icons/io5";
import { PiUserCirclePlusFill } from "react-icons/pi";

import { useCurrentUser } from "../../hooks/user/useCurrentUser";
import { useLogout } from "../../hooks/auth/useLogout";
import { Link, useNavigate } from "react-router";
import ProfileDropDown from "../ui/dropdown/ProfileDropDown";
import NotificationModal from "../ui/dropdown/NotificationDropDown";
import { useLayoutContext } from "../../hooks/context/useLayoutContext";

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const {
    sidebarOpen,
    setOpenLogin,
    isOpen,
    setIsOpen,
    isOpenCreate,
    setIsOpenCreate,
    setSidebarOpen,
    setSearchQuery,
  } = useLayoutContext();


  const { data: currentUser, isLoading } = useCurrentUser();
  const [openNotification, setNotification] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef(null);

  const profileRef = useRef(null);
  const createRef = useRef(null);
  const notificationRef = useRef(null);

  // Profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  // Create dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createRef.current && !createRef.current.contains(event.target)) {
        setIsOpenCreate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpenCreate]);

  // Notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const signOut = () => {
    logout();
    setIsOpen(false);
  };

  const goProfilePage = () => {
    navigate(`/channal/${currentUser?.userName}`);
    setIsOpen(false);
  };

  const showLogin = () => {
    setOpenLogin((prv) => !prv);
    setIsOpen(false);
  };

  const goResgistration = () => {
    navigate("/register");
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.search.value);
  };

  const handleNavigate = () => {
    localStorage.setItem("activeTab", "Tweets");
    navigate(`/channal/${currentUser?.userName}`);
    setIsOpenCreate(false);
  };

  const navigateUploadVideo = () => {
    navigate("/studio/dashboard");
    setIsOpenCreate(false);
  };

  return (
    <div>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[var(--background)] z-40">
        <div className="flex items-center justify-between px-2 sm:px-4 pt-2 pb-4">
          {/* Left section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 hover:bg-[var(--background)] rounded-full cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <HiOutlineBars3 size={25} className="sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded flex items-center justify-center">
                <FiPlay className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" />
              </div>
              <span className="text-base sm:text-xl font-bold">YouTube</span>
            </div>
          </div>

          {/* Search section - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
              <input
                type="text"
                name="search"
                placeholder="Search"
                className="flex-1 px-4 py-2 border border-[var(--secondary)] rounded-l-full focus:outline-none focus:border-blue-500 text-base"
              />
              <button
                type="submit"
                className="px-6 py-2 cursor-pointer bg-[var(--background)] border border-l-0 border-[var(--secondary)] rounded-r-full"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>
            <button className="p-2  rounded-full ml-2">
              <FiMic className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile search bar - Only visible when showMobileSearch is true */}
          {showMobileSearch && (
            <div
              className="absolute top-0 left-0 right-0 bg-[var(--background)] z-50 p-2 md:hidden"
              ref={mobileSearchRef}
            >
              <form onSubmit={handleSubmit} className="flex items-center">
                <button
                  type="button"
                  className="p-2 mr-2 rounded-full"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  name="search"
                  placeholder="Search YouTube"
                  className="flex-1 px-3 py-2 border border-[var(--secondary)] rounded-full focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 ml-2 rounded-full"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Mobile search button */}
            <div className="md:hidden">
              <button
                className="rounded-full p-2"
                onClick={() => setShowMobileSearch(true)}
              >
                <FiSearch size={20} />
              </button>
            </div>

            {/* Create button */}
            <div className="relative hidden md:block" ref={createRef}>
              <button
                onClick={() => setIsOpenCreate(!isOpenCreate)}
                className="cursor-pointer p-2 rounded-full"
              >
                <FiVideo className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              {isOpenCreate && (
                <div className="absolute right-0 top-[110%] w-40 sm:w-48 bg-[var(--background)] text-[var(--foreground)] flex flex-col px-3 sm:px-4 gap-y-2 py-3 sm:py-4 rounded-lg shadow-lg z-50">
                  <div className="flex flex-col gap-y-3 sm:gap-y-4">
                    <div className="flex items-center gap-x-3 sm:gap-x-4">
                      <RiVideoAiLine className="text-lg sm:text-xl" />
                      <button
                        onClick={navigateUploadVideo}
                        className="text-sm sm:text-base font-medium font-display cursor-pointer"
                      >
                        Upload Video
                      </button>
                    </div>

                    <div className="flex items-center gap-x-3 sm:gap-x-4">
                      <IoCreateOutline className="text-lg sm:text-xl" />
                      <button
                        onClick={handleNavigate}
                        className="text-sm sm:text-base font-medium cursor-pointer"
                      >
                        Create Tweets
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notification */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotification(true)}
                className="p-2 cursor-pointer rounded-full relative"
              >
                <FiBell className="w-5 h-5 sm:w-6 sm:h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-[var(--foreground)]">9</span>
                </div>
              </button>

              {openNotification && (
                <NotificationModal onClose={setNotification} />
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[var(--secondary)] focus:outline-none cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {currentUser ? (
                  <img
                    className="w-full h-full object-cover object-center"
                    src={currentUser?.avatar}
                    alt="User Avatar"
                  />
                ) : (
                  <PiUserCirclePlusFill className="text-3xl sm:text-4xl" />
                )}
              </button>
              {isOpen && (
                <ProfileDropDown
                  goProfilePage={goProfilePage}
                  signOut={signOut}
                  goResgistration={goResgistration}
                  showLogin={showLogin}
                  currentUser={currentUser}
                  currentUserLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
