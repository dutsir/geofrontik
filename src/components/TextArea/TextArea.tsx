import { forwardRef, useState } from 'react';
import HelpModal from '../HelpModal/HelpModal';
import styles from './TextArea.module.css'; // Assuming you have a CSS module for TextArea

interface TextAreaProps {
  name: string;
  label: string;
  value?: string;
  error?: string | string[];
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  helpText?: string; // New prop for help text
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, label, value, error, className, onChange, helpText }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
      <div className={`${styles.formGroup} ${className}`}>
        <label htmlFor={name} className={styles.formLabel}>
          <span className={styles.span_forthefirsttry_goih}>{label}</span>
          {helpText && (
            <span className={styles.helpIcon} onClick={handleOpenModal} title="Подробнее">
              ?
            </span>
          )}
        </label>
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className={`${styles.textarea} ${error ? styles.error : ''}`}
        />
        {error && (
          <label className={styles.label_1_gointhestreet_tu_io}>
            <span>
              {typeof error === 'string' ? error : error.join(', ')}
            </span>
          </label>
        )}
        {helpText && (
          <HelpModal isOpen={isModalOpen} onClose={handleCloseModal} title={label}>
            <p>{helpText}</p>
          </HelpModal>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;