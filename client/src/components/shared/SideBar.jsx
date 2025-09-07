import { FiSettings, FiHelpCircle, FiFlag } from "react-icons/fi";
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
import { useGetSubscribedChannel } from "../../hooks/user/useGetSubscribedChannel";
import { useLayoutContext } from "../../hooks/context/useLayoutContext";





const SideBar = () => {
  const { sidebarOpen, currentUser, setOpenLogin } = useLayoutContext();


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


  const navigate = useNavigate();
  const [showMoreSubs, setShowMoreSubs] = useState(false);
  const { data: subscriptions } = useGetSubscribedChannel();

  const handleNavigateChannel = (channelId) => {
    navigate(`/channal/${channelId}`);
  };

  return (
    <div>
      <aside
        className={`fixed overflow-auto scrollbar-hide left-0 top-16 bottom-0 bg-[var(--background)] overflow-y-auto z-50 ${sidebarOpen ? "w-60 sm:w-56 xs:w-48" : "w-24 sm:w-20 xs:w-16"
          }`}
      >
        <div className="p-3">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <NavLink
                to={item?.href}
                key={index}
                className={({ isActive }) =>
                  `w-full flex items-center ${sidebarOpen ? "gap-x-6 px-3 py-2" : "justify-center py-3"
                  } rounded-lg ${isActive ? "bg-[var(--secondary)] font-medium" : "hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && item.label}
              </NavLink>
            ))}
          </div>

          <hr className="my-3 border-[var(--secondary)]" />

          {/* User section */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="flex items-center px-3 py-2 font-medium">
                You
                <AiOutlineDown className="h-4 w-4 ml-2" />
              </div>
            )}
            {userItems.map((item, index) => (
              <NavLink
                key={index}
                to={item?.href}
                className={({ isActive }) =>
                  `w-full flex items-center ${sidebarOpen ? "gap-x-6 px-3 py-2" : "justify-center py-3"
                  } rounded-lg ${isActive ? "bg-[var(--secondary)] font-medium" : "hover:bg-[var(--secondary)]"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && item.label}
              </NavLink>
            ))}
          </div>

          <hr className="my-3 border-[var(--secondary)]" />

          {/* Subscriptions */}
          {currentUser ? <div className="space-y-1">
            {sidebarOpen && (
              <div className="flex items-center px-3 py-2">
                <h3 className="font-medium">Subscriptions</h3>
              </div>
            )}
            {subscriptions &&
              subscriptions
                .slice(0, showMoreSubs ? subscriptions.length : 5)
                .map((subscription, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleNavigateChannel(subscription?.channel?.userName)
                    }
                    className={`w-full flex items-center ${sidebarOpen ? "gap-x-3 px-3 py-2" : "justify-center py-3"
                      } rounded-lg hover:bg-[var(--secondary)]`}
                  >
                    <img
                      src={subscription.channel.avatar}
                      alt={subscription.channel.fullName}
                      className="w-6 h-6 rounded-full bg-gray-200"
                    />
                    {sidebarOpen && (
                      <div className="flex-1 text-left font-medium">
                        {subscription.channel.fullName}
                      </div>
                    )}
                  </button>
                ))}
            {subscriptions && subscriptions.length > 5 && sidebarOpen && (
              <button
                onClick={() => setShowMoreSubs(!showMoreSubs)}
                className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-[var(--foreground)] rounded-lg transition-colors"
              >
                <AiOutlineDown className="h-4 w-4 mr-6" />
                {showMoreSubs ? "Show less" : "Show more"}
              </button>
            )}
          </div> : <div className="px-3">
            <p className={`text-sm mb-2 ${sidebarOpen ? "block" : "hidden"}`}>Sign in to like videos, comment, and subscribe.</p>
            <button onClick={() => setOpenLogin(true)} className={`bg-transparent border border-[var(--secondary)] text-[#3ea6ff] hover:bg-[var(--foreground)] cursor-pointer hover:border-[#3ea6ff]  ${sidebarOpen ? "px-6 py-2" : "px-2 py-1 text-xs"} rounded-full font-medium transition-colors`}>
              {/* Custom user icon using SVG */}

              Sign in
            </button>
          </div>}

          <hr className="my-3 border-[var(--secondary)]" />

          {/* Settings */}
          <div className="space-y-1">
            <button
              className={`w-full flex items-center ${sidebarOpen ? "gap-x-6 px-3 py-2" : "justify-center py-3"
                } rounded-lg hover:bg-[var(--secondary)]`}
            >
              <FiSettings className="w-5 h-5" />
              {sidebarOpen && "Settings"}
            </button>
            <button
              className={`w-full flex items-center ${sidebarOpen ? "gap-x-6 px-3 py-2" : "justify-center py-3"
                } rounded-lg hover:bg-[var(--secondary)]`}
            >
              <FiFlag className="w-5 h-5" />
              {sidebarOpen && "Report history"}
            </button>
            <button
              className={`w-full flex items-center ${sidebarOpen ? "gap-x-6 px-3 py-2" : "justify-center py-3"
                } rounded-lg hover:bg-[var(--secondary)]`}
            >
              <FiHelpCircle className="w-5 h-5" />
              {sidebarOpen && "Help"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
