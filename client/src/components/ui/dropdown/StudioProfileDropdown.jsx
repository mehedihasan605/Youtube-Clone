import { useState } from 'react';
import { AiOutlineYoutube } from 'react-icons/ai';

import {
  MdOutlineLightMode,
  MdArrowBack,
  MdOutlineDarkMode,
  MdOutlineDevices,
  MdCheck,
  MdOutlineFeedback,
  MdLogout,
} from 'react-icons/md';
import { IoChevronForward } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router';
import Loading from '../loading/Loading';
import { BiUserPin } from 'react-icons/bi';
import { useThemeContext } from '../../../hooks/context/useThemeContext';

const StudioProfileDropdown = ({
  currentUser,
  currentUserLoading,
  signOut,
  goProfilePage,
}) => {
  const [currentView, setCurrentView] = useState('main');
  const { mode, setMode } = useThemeContext();
  const navigate = useNavigate();

  const handleAppearanceClick = () => {
    setCurrentView('appearance');
  };

  const handleBackClick = () => {
    setCurrentView('main');
  };

  const handleAppearanceSelect = theme => {
    // theme === "system" | "dark" | "light"
    setMode(theme.toLowerCase());
    setCurrentView('main');
  };

  const renderMainModal = () => (
    <>
      <div className="p-4 border-b border-[var(--secondary)]">
        <div className={`flex items-center gap-3 mb-3`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img
              src={currentUser?.avatar}
              className="object-cover object-center w-full h-full rounded-full"
            />
          </div>
          <div>
            <div className="font-medium">{currentUser?.fullName}</div>

            <div className="text-sm mb-1">@{currentUser?.userName}</div>
          </div>
        </div>
      </div>

      <div className="py-2">
        <button
          onClick={goProfilePage}
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer"
        >
          <BiUserPin className="w-5 h-5 mr-3" />
          <span className="text-sm flex-1 text-left">Your Channel</span>
        </button>

        <Link
          to="/"
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer"
        >
          <AiOutlineYoutube className="w-5 h-5 mr-3" />
          <span className="text-sm flex-1 text-left">Youtube</span>
        </Link>

        <button
          onClick={signOut}
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)]transition-colors cursor-pointer"
        >
          <MdLogout className="w-5 h-5 mr-3 " />
          <span className="text-sm  flex-1 text-left">Logout</span>
        </button>

        <div className="border-t border-[var(--secondary)] hover:bg-[var(--secondary)] my-2"></div>

        <div
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={handleAppearanceClick}
        >
          <MdOutlineLightMode className="w-5 h-5 mr-3 " />
          <span className="text-sm  flex-1 text-left">
            Appearance:{' '}
            {mode === 'system'
              ? 'Use device theme'
              : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </span>
          <IoChevronForward className="w-4 h-4" />
        </div>

        <div className="border-t border-[var(--secondary)] hover:bg-[var(--secondary)] my-2"></div>

        <div className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <MdOutlineFeedback className="w-5 h-5 mr-3 " />
          <span className="text-sm  flex-1 text-left">Send feedback</span>
        </div>
      </div>
    </>
  );

  const renderAppearanceModal = () => (
    <>
      <div className="p-4 border-b border-[var(--secondary)] hover:bg-[var(--secondary)]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            onClick={handleBackClick}
          >
            <MdArrowBack className="w-5 h-5 " />
          </div>
          <span className="text-lg font-medium ">Appearance</span>
        </div>
      </div>

      <div className="py-2">
        <div className="px-4 py-2">
          <p className="text-sm ">Setting applies to this browser only</p>
        </div>

        <div
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={() => handleAppearanceSelect('system')}
        >
          <MdOutlineDevices className="w-5 h-5 mr-3 " />
          <span className="text-sm  flex-1 text-left">Use device theme</span>
          {mode === 'system' && <MdCheck className="w-5 h-5 text-blue-600" />}
        </div>

        <div
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={() => handleAppearanceSelect('Dark')}
        >
          <MdOutlineDarkMode className="w-5 h-5 mr-3 " />
          <span className="text-sm  flex-1 text-left">Dark theme</span>
          {mode === 'dark' && <MdCheck className="w-5 h-5 text-blue-600" />}
        </div>

        <div
          className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={() => handleAppearanceSelect('Light')}
        >
          <MdOutlineLightMode className="w-5 h-5 mr-3 " />
          <span className="text-sm  flex-1 text-left">Light theme</span>
          {mode === 'light' && <MdCheck className="w-5 h-5 text-blue-600" />}
        </div>
      </div>
    </>
  );

  if (currentUserLoading) return <Loading />;

  return (
    <div className="absolute w-80 right-[2%] top-[80%]  rounded-lg shadow-lg border border-[var(--secondary)] bg-[var(--background)] overflow-hidden">
      <div className="p-0">
        {currentView === 'main' ? renderMainModal() : renderAppearanceModal()}
      </div>
    </div>
  );
};
export default StudioProfileDropdown;
