import {
  MdOutlineWatchLater,
  MdPlaylistAddCheck,
} from "react-icons/md";

const ThreeDot = ({
  video,
  watchlater,
  closeModal,
  openPlaylistModal,
}) => {
  
 

  const menuItems = [
    {
      icon: <MdOutlineWatchLater size={24} />,
      text: "Save to Watch later",
      onClick: async () => {
        await watchlater(video._id);
        closeModal();
      },
    },
    {
      icon: <MdPlaylistAddCheck size={24} />,
      text: "Save to playlist",
      onClick: () => {
        openPlaylistModal(video._id);
        closeModal();
      },
    },
  ];



  return (
    // Backdrop layer
    <div
      className="absolute right-0 mt-2 z-50 bg-[var(--background)] text-[var(--foreground)] rounded-xl bottom-5 shadow-2xl w-64 py-2"
    >
      {/* Modal content */}
      <div
        className="absolute bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-2xl w-64 py-2"
      >
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                onClick={item.onClick}
                href="#"
                className="flex items-center px-4 py-2 text-sm hover:bg-[var(--secondary)] cursor-pointer"
              >
                <span className="mr-4 text-gray-600">{item.icon}</span>
                <span>{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThreeDot;
