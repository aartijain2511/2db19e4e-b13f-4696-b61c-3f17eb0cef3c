import React, { useState } from "react";
import styled from "styled-components";

interface DropdownProps {
  options: string[]; // Array of options to display
  onSelect: (selectedOption: string) => void; // Function to call when an option is selected
}

const DropdownList: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0] || "");

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-list">
      <button onClick={() => setIsOpen(!isOpen)}>{selectedOption}</button>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <StyldeItem key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </StyldeItem>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownList;

const StyledList = styled.ul`
text-decoration: none;
`;
const StyldeItem = styled.li`
list-style-type: none;
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
  }
`;
