import React from 'react';
import styles from './TextInput.module.css';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ 
  label, 
  error, 
  required,
  type,
  value,
  onChange,
  ...props 
}, ref) => {
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
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;