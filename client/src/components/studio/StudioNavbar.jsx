import { useEffect, useRef, useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdSearch, MdHelpOutline, MdMenu } from 'react-icons/md';
import { RiVideoAddLine } from 'react-icons/ri';
import CreateDropdown from '../ui/dropdown/CreateDropdown';
import StudioProfileDropdown from '../ui/dropdown/StudioProfileDropdown';
import { useNavigate } from 'react-router';
import { useLogout } from '../../hooks/auth/useLogout';
import { useLayoutContext } from '../../hooks/context/useLayoutContext';

const StudioNavbar = () => {
  const {
    isMobile,
    currentUser,
    currentUserLoading,
    setPlaylist,
    studioSidebarOpen,
    setStudioSidebarOpen,
    isVideoUploadOpen,
    setVideoUploadOpen,
  } = useLayoutContext();

  const [isCreateDropdownOpen, setCreateDropdown] = useState(false);
  const [isOpenProfileDropdown, setProfileDrodown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const logout = useLogout();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const createRef = useRef(null);

  const signOut = () => {
    logout();
    setProfileDrodown(false);
    navigate('/');
  };

  const goProfilePage = () => {
    navigate(`/channal/${currentUser?.userName}`);
    setProfileDrodown(false);
  };

  // Profile dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDrodown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Create dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (createRef.current && !createRef.current.contains(event.target)) {
        setCreateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <header className="bg-[var(--background)] text-[var(--foreground)] fixed top-0 w-full  px-4 pt-3 pb-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              className="p-2 rounded-full cursor-pointer"
              onClick={() => setStudioSidebarOpen(!studioSidebarOpen)}
            >
              <MdMenu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-red-600 rounded flex items-center justify-center">
                <div className="w-3 h-2 lg:w-5 lg:h-3 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg lg:text-xl font-medium hidden sm:block">
                Studio
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          {!showMobileSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search across your channel"
                  className="w-full pl-10 pr-4 py-2  border border-[var(--secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Mobile Search */}
          {showMobileSearch && (
            <div className="flex-1 mx-2 md:hidden">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search across your channel"
                  className="w-full pl-10 pr-4 py-2  border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 lg:gap-2">
            {/* Mobile Search Toggle */}
            {!showMobileSearch && (
              <button
                className="p-2  rounded-full md:hidden"
                onClick={() => setShowMobileSearch(true)}
              >
                <MdSearch className="h-5 w-5" />
              </button>
            )}

            {/* Close Mobile Search */}
            {showMobileSearch && (
              <button
                className="p-2  rounded-full md:hidden"
                onClick={() => setShowMobileSearch(false)}
              >
                <span className="text-sm">Cancel</span>
              </button>
            )}

            {!showMobileSearch && (
              <>
                <button className="p-2  rounded-full hidden sm:block">
                  <MdHelpOutline size={isMobile ? 20 : 25} />
                </button>
                <button className="p-2  rounded-full hidden sm:block">
                  <IoMdNotificationsOutline size={isMobile ? 20 : 25} />
                </button>
                <div className="relative" ref={createRef}>
                  <button
                    onClick={() => setCreateDropdown(!isCreateDropdownOpen)}
                    className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 border border-[var(--secondary)] rounded-lg  cursor-pointer"
                  >
                    <RiVideoAddLine size={isMobile ? 20 : 25} />
                    <span className="hidden lg:block">Create</span>
                  </button>

                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isSet={setVideoUploadOpen}
                      setPlaylist={setPlaylist}
                      currentUser={currentUser}
                    />
                  )}
                </div>
                {/* profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none cursor-pointer"
                    onClick={() => setProfileDrodown(!isOpenProfileDropdown)}
                  >
                    <img
                      className="w-full h-full object-cover object-center"
                      src={currentUser?.avatar}
                    />
                  </button>
                  {isOpenProfileDropdown && (
                    <StudioProfileDropdown
                      currentUser={currentUser}
                      currentUserLoading={currentUserLoading}
                      goProfilePage={goProfilePage}
                      signOut={signOut}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default StudioNavbar;
