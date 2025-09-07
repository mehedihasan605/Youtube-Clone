import { useState } from "react";
import {
  FaGoogle,
  FaDollarSign,
  FaKeyboard,
  FaCog,
  FaQuestionCircle,
  FaCommentDots,
} from "react-icons/fa";
import { LuUserPlus } from "react-icons/lu";
import {
  MdLogout,
  MdOutlineVideoLibrary,
  MdOutlineLightMode,
  MdOutlineLanguage,
  MdOutlineShield,
  MdOutlineLocationOn,
  MdArrowBack,
  MdOutlineDarkMode,
  MdOutlineDevices,
  MdCheck,
} from "react-icons/md";
import { IoChevronForward } from "react-icons/io5";
import { Link } from "react-router";
import Loading from "../loading/Loading";
import { PiUserCirclePlusFill } from "react-icons/pi";
import { BiLogInCircle } from "react-icons/bi";
import { useThemeContext } from "../../../hooks/context/useThemeContext";

const ProfileDropDown = ({
  goProfilePage,
  signOut,
  goResgistration,
  showLogin,
  currentUser,
  currentUserLoading,
}) => {
  const [currentView, setCurrentView] = useState("main");
  const { mode, setMode } = useThemeContext();

  const handleAppearanceClick = () => {
    setCurrentView("appearance");
  };

  const handleBackClick = () => {
    setCurrentView("main");
  };

  const handleAppearanceSelect = (theme) => {
    // theme === "system" | "dark" | "light"
    setMode(theme.toLowerCase());
    setCurrentView("main");
  };

  const renderMainModal = () => (
    <div>
      <div className="p-4 border-b border-[var(--secondary)]">
        <div className={`flex ${!currentUser && "items-center"} gap-3 mb-3`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            {currentUser ? (
              <img
                src={currentUser?.avatar}
                className="object-cover object-center w-full h-full rounded-full"
              />
            ) : (
              <PiUserCirclePlusFill className="text-4xl" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-[var(--foreground)]">
              {currentUser ? currentUser?.fullName : "User Not Login"}
            </div>
            {currentUser && (
              <>
                <div className="text-[var(--foreground)] text-sm mb-1">
                  @{currentUser?.userName}
                </div>
                <button
                  onClick={goProfilePage}
                  className="text-blue-600 text-sm font-normal cursor-pointer"
                >
                  View your channel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="py-2">
        {currentUser ? (
          <>
            <Link to="/studio/dashboard" className="w-full flex items-center px-4 py-3 hover:bg-[var(--secondary)] transition-colors cursor-pointer">
              <MdOutlineVideoLibrary className="w-5 h-5 mr-3" />
              <span className="text-sm flex-1 text-left">
                YouTube Studio
              </span>
            </Link>

            <button
              onClick={signOut}
              className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
            >
              <MdLogout className="w-5 h-5 mr-3" />
              <span className="text-sm  flex-1 text-left">
                Logout
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={goResgistration}
              className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
            >
              <LuUserPlus className="w-5 h-5 mr-3" />
              <span className="text-sm  flex-1 text-left">
                Registration
              </span>
            </button>

            <button
              onClick={showLogin}
              className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
            >
              <BiLogInCircle className="w-5 h-5 mr-3" />
              <span className="text-sm  flex-1 text-left">
                Login
              </span>
            </button>
          </>
        )}

        <div className="border-t border-[var(--secondary)] my-2"></div>

        <div
          className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={handleAppearanceClick}
        >
          <MdOutlineLightMode className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left"> Appearance: {mode === "system" ? "Use device theme" : mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
          <IoChevronForward className="w-4 h-4" />
        </div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <MdOutlineLanguage className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Language: English
          </span>
          <IoChevronForward className="w-4 h-4" />
        </div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <MdOutlineShield className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Restricted Mode: Off
          </span>
          <IoChevronForward className="w-4 h-4" />
        </div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <MdOutlineLocationOn className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Location: Bangladesh
          </span>
          <IoChevronForward className="w-4 h-4" />
        </div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <FaKeyboard className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Keyboard shortcuts
          </span>
        </div>

        <div className="border-t border-[var(--secondary)] my-2"></div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <FaCog className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Settings
          </span>
        </div>

        <div className="border-t border-[var(--secondary)] my-2"></div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <FaQuestionCircle className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">Help</span>
        </div>

        <div className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer">
          <FaCommentDots className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Send feedback
          </span>
        </div>
      </div>
    </div>
  );

  const renderAppearanceModal = () => (
    <>
      <div className="p-4 border-b border-[var(--secondary)]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            onClick={handleBackClick}
          >
            <MdArrowBack className="w-5 h-5" />
          </div>
          <span className="text-lg font-medium ">Appearance</span>
        </div>
      </div>

      <div className="py-2">
        <div className="px-4 py-2">
          <p className="text-sm">
            Setting applies to this browser only
          </p>
        </div>

        <div
          className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={() => handleAppearanceSelect("system")}
        >
          <MdOutlineDevices className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Use device theme
          </span>
          {mode === "system" && <MdCheck className="w-5 h-5 text-blue-600" />}
        </div>

        <div
          className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={() => handleAppearanceSelect("Dark")}
        >
          <MdOutlineDarkMode className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Dark theme
          </span>
          {mode === "dark" && <MdCheck className="w-5 h-5 text-blue-600" />}
        </div>

        <div
          className="w-full flex items-center px-4 py-3  hover:bg-[var(--secondary)] transition-colors cursor-pointer"
          onClick={() => handleAppearanceSelect("Light")}
        >
          <MdOutlineLightMode className="w-5 h-5 mr-3" />
          <span className="text-sm  flex-1 text-left">
            Light theme
          </span>
          {mode === "light" && <MdCheck className="w-5 h-5 text-blue-600" />}
        </div>
      </div>
    </>
  );

  if (currentUserLoading) return <Loading />;

  return (
    <div className="absolute  w-80 right-[2%] top-[80%]  bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-lg border border-[var(--secondary)] overflow-hidden">
      <div className="p-0">
        {currentView === "main" ? renderMainModal() : renderAppearanceModal()}
      </div>
    </div>
  );
};
export default ProfileDropDown;
