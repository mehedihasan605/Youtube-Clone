import React, { useState, useRef, useEffect } from "react";
import { MdOutlineSort } from "react-icons/md";

const CommentSortDropdown = ({ sort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = () => {
    setIsOpen(false);
    sort("createdAt");
  };

  return (
    <div className="relative text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center cursor-pointer justify-center rounded-md px-2 py-2 bg-transparent text-sm font-medium"
        >
          <MdOutlineSort className="h-5 w-5 mr-2" />
          Sort by
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg z-10">
          <button
            onClick={handleOptionClick}
            className={`py-3 px-2 text-sm w-full text-left bg-[var(--background)] cursor-pointer`}
          >
            Comment (newest)
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSortDropdown;
