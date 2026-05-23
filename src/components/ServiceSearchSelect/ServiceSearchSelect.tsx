import React, { useState, useRef, useEffect } from "react";
import "./ServiceSearchSelect.scss";

interface Option {
  value: string;
  label: string;
}

interface ServiceSearchSelectProps {
  label: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const ServiceSearchSelect = ({
  label,
  options,
  onChange,
  placeholder = "--",
}: ServiceSearchSelectProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const safeOptions = options ?? [];
  const filtered = query
    ? safeOptions.filter((opt) =>
        (opt.label ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (option: Option) => {
    setSelectedLabel(option.label);
    setQuery(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    if (!val) {
      setSelectedLabel("");
      onChange("");
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (selectedLabel) {
      setQuery("");
    }
  };

  const handleBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        if (selectedLabel) {
          setQuery(selectedLabel);
        }
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (selectedLabel) {
          setQuery(selectedLabel);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedLabel]);

  return (
    <div className="service-search-select" ref={containerRef}>
      <label className="search-select-label">
        <p>{label}</p>
        <input
          ref={inputRef}
          type="text"
          className={`search-select-input ${selectedLabel ? "has-value" : ""}`}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>
      {isOpen && query.length > 0 && filtered.length > 0 && (
        <ul className="search-select-dropdown">
          {filtered.map((option, index) => (
            <li
              key={index}
              className={`search-select-option ${option.label === selectedLabel ? "selected" : ""}`}
              onMouseDown={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceSearchSelect;
