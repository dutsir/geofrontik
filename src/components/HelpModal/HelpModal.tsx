import React from 'react';
import ReactDOM from 'react-dom';
import styles from './HelpModal.module.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default HelpModal; 