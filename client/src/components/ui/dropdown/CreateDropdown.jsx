import { LuUpload, LuPencilLine, LuListPlus, LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router';

const CreateDropdown = ({ isSet, setPlaylist, currentUser }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    localStorage.setItem('activeTab', 'Tweets');
    navigate(`/channal/${currentUser?.userName}`);
  };

  const menuItems = [
    {
      id: 1,
      label: 'Upload videos',
      icon: <LuUpload size={20} />,
      onClick: () => isSet(true),
    },

    {
      id: 3,
      label: 'Create post',
      icon: <LuPencilLine size={20} />,
      onClick: handleNavigate,
    },
    {
      id: 4,
      label: 'New playlist',
      icon: <LuListPlus size={20} />,
      onClick: () => setPlaylist(true),
    },
  ];

  return (
    <div className="absolute top-10 right-0 text-center">
      <div
        className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-[var(--background)] text-[var(--foreground)] shadow-lg"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {menuItems.map(item => (
            <button
              key={item.id}
              href={item.href}
              onClick={item.onClick}
              className="flex items-center px-4 py-2 text-sm hover:bg-[var(--secondary)]  cursor-pointer w-full"
              role="menuitem"
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateDropdown;
