import React, { useState, useRef, useEffect } from 'react';
import styles from './Autocomplete.module.css';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteProps {
  label: string;
  options: Option[];
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  options,
  error,
  required,
  value,
  onChange,
  name,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value);
      if (option) {
        setSelectedOption(option);
        setInputValue(option.label);
      }
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    if (onChange) {
      onChange('');
    }
    setSelectedOption(null);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setInputValue(option.label);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isOpen && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionClick(filteredOptions[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={styles.formGroup} ref={wrapperRef}>
      <label className={styles.formLabel}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.autocomplete}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`${styles.formInput} ${error ? styles.error : ''}`}
          name={name}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="options-list"
        />
        {isOpen && filteredOptions.length > 0 && (
          <div 
            id="options-list"
            className={styles.optionsList}
            role="listbox"
          >
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={`${styles.option} ${selectedOption?.value === option.value ? styles.selected : ''}`}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionClick(option);
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Autocomplete;