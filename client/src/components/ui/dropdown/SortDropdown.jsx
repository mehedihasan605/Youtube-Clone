import React, { useState, useRef, useEffect } from "react";
import { MdOutlineSort } from "react-icons/md";

const SortDropdown = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Date added (newest)");

  const dropdownRef = useRef(null);

  const options = [
    { label: "Playlist Create (newest)", value: "createdAt" },
    { label: "Last video added", value: "updatedAt" },
  ];

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

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onSortChange(option.value); 
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
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`py-3 px-2 text-sm w-full text-left ${
                selectedOption === option
                ? "bg-[var(--secondary)]"
                  : "bg-[var(--background)] hover:bg-[var(--muted)]"
              }  bg-[var(--secondary)]`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
