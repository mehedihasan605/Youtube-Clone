import {
  MdDashboard,
  MdDescription,
  MdPalette,
  MdSettings,
  MdFeedback,
} from 'react-icons/md';
import { NavLink } from 'react-router';
import { useLayoutContext } from '../../hooks/context/useLayoutContext';

const StudioSideBar = () => {
  const { currentUser, isMobile, studioSidebarOpen, setStudioSidebarOpen } =
    useLayoutContext();

  return (
    <>
      <aside
        className={`
        w-64 fixed left-0 bg-[var(--background)] min-h-screen top-16 lg:top-17 transition-transform duration-300 z-50
        ${
          isMobile
            ? studioSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        }
      `}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-6 pt-2">
            <img
              src={currentUser?.avatar}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mb-3 object-cover object-center"
              alt="Profile"
            />

            <div>
              <div className="font-medium text-sm">Your channel</div>
              <div className="text-xs text-gray-500 truncate max-w-[200px]">
                {currentUser?.fullName}
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="dashboard"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-sm ${
                  isActive
                    ? 'bg-[var(--secondary)] font-medium'
                    : 'hover:bg-[var(--secondary)]'
                }`
              }
              onClick={() => isMobile && setStudioSidebarOpen(false)}
            >
              <MdDashboard className="h-4 w-4 flex-shrink-0" />
              Dashboard
            </NavLink>
            <NavLink
              to="content"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-sm ${
                  isActive
                    ? 'bg-[var(--secondary)] font-medium'
                    : 'hover:bg-[var(--secondary)]'
                }`
              }
              onClick={() => isMobile && setStudioSidebarOpen(false)}
            >
              <MdDescription className="h-4 w-4 flex-shrink-0" />
              Content
            </NavLink>

            <NavLink
              to="customization"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-sm ${
                  isActive
                    ? 'bg-[var(--secondary)] font-medium'
                    : 'hover:bg-[var(--secondary)]'
                }`
              }
              onClick={() => isMobile && setStudioSidebarOpen(false)}
            >
              <MdPalette className="h-4 w-4 flex-shrink-0" />
              Customization
            </NavLink>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-[var(--secondary)] text-sm">
              <MdSettings className="h-4 w-4 flex-shrink-0" />
              Settings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-[var(--secondary)] text-sm">
              <MdFeedback className="h-4 w-4 flex-shrink-0" />
              Send feedback
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default StudioSideBar;
