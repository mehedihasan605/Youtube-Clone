import { Outlet, useLocation } from "react-router";
import Navbar from "../components/shared/NavBar";
import SideBar from "../components/shared/SideBar";
import SideBarVideoDetails from "../components/shared/SideBarVideoDetails";
import Login from "../components/ui/modal/Login";
import { useLayoutContext } from "../hooks/context/useLayoutContext";
import { useEffect } from "react";



const HomeLayout = () => {
  const { sidebarOpen, shouldHideSidebar, hideSidebar, openLogin, useSidebarVideoDetails, setUseSidebarVideoDetails, setSidebarOpen, setHideSidebar } = useLayoutContext()
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(!shouldHideSidebar);
  }, [setSidebarOpen, shouldHideSidebar]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // At 1301px or less, close the sidebar
      if (width <= 1280) {
        setSidebarOpen(false);
      } else {
        // Only open sidebar if we're not on a video page
        if (!shouldHideSidebar) {
          setSidebarOpen(true);
        }
      }

      // When width is 1021px or less, completely hide the sidebar component
      if (width <= 1024) {
        setHideSidebar(true);
        // Use SidebarVideoDetails component when on video page or home page
        if (
          location.pathname === "/" ||
          location.pathname.startsWith === "/channal/" ||
          shouldHideSidebar
        ) {
          setUseSidebarVideoDetails(true);
         
        }
      } else {
        setHideSidebar(false);
        setUseSidebarVideoDetails(false);
      }

    };

    // Set initial state based on window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [shouldHideSidebar, setSidebarOpen, setHideSidebar, setUseSidebarVideoDetails, location.pathname]);

  useEffect(() => {
    if (
      (location.pathname === "/" ||
        location.pathname.startsWith === "/channal/" ||
        shouldHideSidebar) &&
      window.innerWidth <= 1024
    ) {
      setUseSidebarVideoDetails(true);
    }
    else {
      if (shouldHideSidebar) {
        setUseSidebarVideoDetails(true)
      }
    }

  }, [shouldHideSidebar, sidebarOpen, setUseSidebarVideoDetails, location.pathname]);

  return (
    <div>
      <Navbar />
      <div className="flex pt-14 w-full">
        {!shouldHideSidebar && !hideSidebar && <SideBar />}

        <div
          className={`w-full transition-all duration-200 ${sidebarOpen && !hideSidebar && !shouldHideSidebar ? "ml-0 lg:ml-52" : shouldHideSidebar ? "ml-0" : "ml-0 lg:ml-20"


            }`}
        >
          <Outlet />
        </div>

        {useSidebarVideoDetails && sidebarOpen && (

          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
            <SideBarVideoDetails />
          </div>
        )}

        {openLogin && <Login />}
      </div>
    </div>
  );
};

export default HomeLayout;
