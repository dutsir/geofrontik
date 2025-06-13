import React, { useState, useEffect } from 'react';
import styles from './homik_page.module.css';
import AnimatedFeatures from './AnimatedFeatures';

const HomikPage: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number>(0);

  useEffect(() => {
    const sendVisitData = async () => {
      try {
        const response = await fetch('http://localhost:5173/api/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: 'home',
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.totalVisits);
        }
      } catch (error) {
        console.error('непонятки при отправке данных о посещении:', error);
      }
    };

    const fetchVisitCount = async () => {
      try {
        const response = await fetch('http://localhost:5173/api/visits');
        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.totalVisits);
        }
      } catch (error) {
        console.error('непонятки при получении количества посещений:', error);
      }
    };

    fetchVisitCount();
    sendVisitData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Добро пожаловать в геодезическую систему</h1>
      <div className={styles.visitCounter}>
        <p>Количество посещений: {visitCount}</p>
      </div>
      <div className={styles.content}>
        <p className={styles.description}>
          Система предназначена для ведения учета и мониторинга геодезических пунктов.
        </p>
      </div>
      <AnimatedFeatures />
    </div>
  );
};

export default HomikPage;
