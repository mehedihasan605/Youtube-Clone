import { useState } from "react";

const WatchLaterSort = ({ setIsOpen, onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState("Date added (newest)");
  const options = [
    { label: "Date added (newest)", value: "newest" },
    { label: "Date added (oldest)", value: "oldest" },
  ];
  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onSortChange(option.value);
  };



  return (
    <div className="absolute left-0 top-8 mt-2 w-56 rounded-md shadow-lg z-50">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleOptionClick(option)}
          className={`py-3 px-2 text-sm w-full cursor-pointer text-left ${selectedOption === option
              ? "bg-[var(--secondary)] text-[var(--foreground)]"
              : ""
            } bg-[var(--background)]`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default WatchLaterSort;
