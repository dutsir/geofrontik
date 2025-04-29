import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './no_access_page.module.css';

const NoAccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Доступ запрещен</h1>
        <p className={styles.message}>
          У вас нет прав для доступа к этой странице. Эта страница доступна только для администраторов.
        </p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/home')}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default NoAccessPage; 