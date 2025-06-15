import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch, placeholder = "Search..." }) => {
  return (
    <div className="w-full flex items-center border-b border-gray-200 pb-4 mb-4">
      <FaMagnifyingGlass className="text-gray-400 mr-3" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full focus:outline-none text-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {value && (
        <IoMdClose
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={onClearSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
