import React from 'react';
import styles from './RadioGruop.module.css';

interface RadioItem {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label: string;
  items: RadioItem[];
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  items,
  required,
  error,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.radioGroup}>
        {items.map((item) => (
          <label key={item.value} className={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={value === item.value}
              onChange={handleChange}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>{item.label}</span>
          </label>
        ))}
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default RadioGroup;