import { FiSettings, FiHelpCircle, FiFlag, FiPlay } from "react-icons/fi";

import {
  AiOutlineHome,
  AiOutlinePlaySquare,
  AiOutlineHistory,
  AiOutlineClockCircle,
  AiOutlineLike,
  AiOutlineVideoCamera,
  AiOutlineUnorderedList,
  AiOutlineDown,
} from "react-icons/ai";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useGetSubscribedChannel } from "../../hooks/user/useGetSubscribedChannel";
import { useLayoutContext } from "../../hooks/context/useLayoutContext";




const SideBarVideoDetails = () => {
  const { setSidebarOpen, currentUser, setOpenLogin } = useLayoutContext();
  const [showMoreSubs, setShowMoreSubs] = useState(false);
  const navigate = useNavigate()

  const navigationItems = [
    { icon: AiOutlineHome, label: "Home", href: "/" },
    { icon: AiOutlinePlaySquare, label: "Subscriptions", href: "/subscriptions" },
  ];


  const userItems = [
    { icon: AiOutlineHistory, label: "History", href: "/history" },
    currentUser && { icon: AiOutlineUnorderedList, label: "Playlists", href: "/playlists" },
    currentUser && { icon: AiOutlineVideoCamera, label: "Your videos", href: "/studio/content" },
    { icon: AiOutlineClockCircle, label: "Watch later", href: "/watch-later" },
    { icon: AiOutlineLike, label: "Liked videos", href: "/liked" },
  ].filter(Boolean);  // 🟢 false/null remove hoye jabe


  const handleNavigateChannel = (channelId) => {
    navigate(`/channal/${channelId}`);
  };

  const { data: subscriptions } = useGetSubscribedChannel();

  return (
    <div className="h-full w-60 bg-[var(--background)] text-[var(--foreground)] z-50 scrollbar-hide min-h-screen overflow-auto scrollbar-hide  overflow-y-auto slideIn">
      {/* Top section */}
      <div className="flex items-center gap-4 py-2 px-3">
        <button
          className="p-2 rounded-full cursor-pointer"
          onClick={() =>
            setSidebarOpen((prv) => (prv === false ? true : false))
          }
        >
          <HiOutlineBars3 size={25} />
        </button>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <FiPlay className="w-4 h-4 fill-current text-white" />
          </div>
          <span className="text-xl font-bold">YouTube</span>
        </div>
      </div>
      {/* Sidebar */}
      <aside>
        <div className="p-3">
          {/* Main navigation */}
          <div className={`space-y-1`}>
            {navigationItems.map((item, index) => (
              <NavLink
                to={item?.href}
                key={index}
                className={({ isActive }) =>
                  `w-full flex items-center gap-x-6 px-3 py-2 rounded-lg ${isActive ? "bg-[var(--secondary)] font-medium" : "hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <hr className="my-3 border-[var(--secondary)]" />

          {/* user section */}

          <div className="space-y-1">
            <div className="flex items-center px-3 py-2  font-medium text-[var(--foreground)]">
              You
              <AiOutlineDown className="h-4 w-4 ml-2" />
            </div>
            {userItems.map((item, index) => (
              <NavLink
                to={item?.href}
                key={index}
                className={({ isActive }) =>
                  `w-full flex items-center gap-x-6 px-3 py-2 rounded-lg ${isActive ? "bg-[var(--secondary)] font-medium" : "hover:bg-[var(--secondary)]"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <hr className="my-3 border-[var(--secondary)]" />

          {/* Subscriptions section */}

          {
            currentUser ? <div className="space-y-1">
              <div className="flex items-center px-3 py-2">
                <h3 className=" font-medium">Subscriptions</h3>
              </div>
              {subscriptions
                ?.slice(0, showMoreSubs ? subscriptions.length : 5)
                .map((subscription, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleNavigateChannel(subscription?.channel?.userName)
                    }
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg  hover:bg-[var(--secondary)]"
                  >
                    <div className="relative">
                      <img
                        src={subscription.channel.avatar}
                        alt={subscription.channel.fullName}
                        className="w-6 h-6 rounded-full bg-gray-200"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">
                        {subscription.channel.fullName}
                      </div>
                    </div>
                  </button>
                ))}
              {subscriptions?.length > 5 && (
                <button
                  onClick={() => setShowMoreSubs(!showMoreSubs)}
                  className="w-full flex items-center px-3 py-2  text-gray-700 hover:bg-[var(--foreground)] rounded-lg transition-colors"
                >
                  <AiOutlineDown className="h-4 w-4 mr-6" />
                  {showMoreSubs ? "Show less" : "Show more"}
                </button>
              )}
            </div> : <div className="px-3">
              <p className="text-sm mb-2">Sign in to like videos, comment, and subscribe.</p>
              <button onClick={() => setOpenLogin(true)} className="bg-transparent border border-[var(--secondary)] text-[#3ea6ff] hover:bg-[var(--foreground)] cursor-pointer hover:border-[#3ea6ff] px-6 py-2 rounded-full font-medium transition-colors">
                {/* Custom user icon using SVG */}

                Sign in
              </button>
            </div>
          }


          <hr className="my-3 border-[var(--secondary)]" />

          {/* Settings */}

          <div className="space-y-1">
            <button className="w-full flex items-center gap-6 px-3 py-2 rounded-lg  hover:bg-[var(--secondary)]">
              <FiSettings className="w-5 h-5" />
              Settings
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2 rounded-lg  hover:bg-[var(--secondary)]">
              <FiFlag className="w-5 h-5" />
              Report history
            </button>
            <button className="w-full flex items-center gap-6 px-3 py-2 rounded-lg  hover:bg-[var(--secondary)]">
              <FiHelpCircle className="w-5 h-5" />
              Help
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideBarVideoDetails;
