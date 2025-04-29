import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPage.module.css';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Карточка успешно создана!</h2>
      <p className={styles.message}>
        Ваша карточка обследования пункта ГГС была успешно сохранена.
      </p>
      <button 
        onClick={() => navigate('/survey')}
        className={styles.button}
      >
        Создать новую карточку
      </button>
    </div>
  );
};

export default SuccessPage; 