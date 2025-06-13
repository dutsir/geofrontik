import React, { useState } from 'react';
import styles from './TextInput.module.css';
import HelpModal from '../HelpModal/HelpModal';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: React.ReactNode;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ 
  label, 
  error, 
  required,
  type,
  value,
  onChange,
  helpText,
  ...props 
}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const val = e.target.value;
      if (val === '') {
        e.target.value = '0';
      }
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>
        {label}
        {required && <span className={styles.required}>*</span>}
        {helpText && (
          <span className={styles.helpIcon} onClick={handleOpenModal} title="Подробнее">
            ?
          </span>
        )}
      </label>
      <input
        ref={ref}
        className={`${styles.formInput} ${error ? styles.error : ''}`}
        type={type}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}

      {helpText && (
        <HelpModal isOpen={isModalOpen} onClose={handleCloseModal} title={label}>
          <p>{helpText}</p>
        </HelpModal>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;