import { useState, useRef, useEffect } from "react";
import { dropDown as SelectIcon } from "@utilities/icons";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  dropdownClassName?: string;
  isDark?: boolean;
  icon?: React.ReactNode;
  iconClassName?: string;
};

export const CustomSelect = ({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className = "",
  dropdownClassName = "",
  isDark = false,
  icon,
  iconClassName = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div className="flex items-center w-full">
        <div className="flex h-11 flex-1 items-center gap-3 rounded-full bg-white ps-4 min-w-0">
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full bg-transparent text-sm text-[#584ABC] focus:outline-none cursor-pointer text-left"
          >
            {selectedOption ? selectedOption.label : placeholder}
          </button>
          
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex-shrink-0"
          >
            <SelectIcon className="w-6 h-6 p-1  rounded-full !text-black" />
          </button>

          {icon && (
            <div className="text-white">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-full rounded-2xl shadow-lg ${
            isDark ? "bg-[#1B1D2A]" : "bg-white"
          } border ${
            isDark ? "border-[#393C4C]" : "border-[#E9E9F0]"
          } max-h-60 overflow-y-auto ${dropdownClassName}`}
        >
          <div className="py-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  selectedValue === option.value
                    ? isDark
                      ? "bg-[#584ABC]/20 text-white"
                      : "bg-[#F4F4FF] text-[#584ABC]"
                    : isDark
                    ? "text-white hover:bg-[#393C4C]"
                    : "text-[#584ABC] hover:bg-[#F4F4FF]"
                } ${
                  selectedValue === option.value ? "font-semibold" : "font-medium"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
