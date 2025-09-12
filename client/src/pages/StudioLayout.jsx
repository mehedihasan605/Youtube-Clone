import StudioSideBar from '../components/studio/StudioSidebar';
import StudioNavbar from '../components/studio/StudioNavbar';
import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useLayoutContext } from '../hooks/context/useLayoutContext';

const StudioLayout = () => {
  const { studioSidebarOpen, setStudioSidebarOpen, isMobile, setIsMobile } =
    useLayoutContext();

  // useEffect
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setStudioSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setIsMobile, setStudioSidebarOpen]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-16 lg:mb-17">
        <StudioNavbar />
      </div>

      <div className="flex">
        {/* Sidebar */}
        {studioSidebarOpen && <StudioSideBar />}

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isMobile ? 'ml-0' : studioSidebarOpen ? 'ml-64' : 'ml-10'
          }`}
        >
          <Outlet />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && studioSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setStudioSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudioLayout;
