import React from 'react';
import { motion } from 'framer-motion';
import styles from './AnimatedFeatures.module.css';

const AnimatedFeatures: React.FC = () => {
  const features = [
    {
      number: 1,
      title: "Карта пунктов",
      description: "Просмотр и анализ расположения геодезических пунктов на карте",
      image: "/map_for_homik.png",
      features: ["Интерактивная карта", "Фильтрация по районам", "Детальная информация"]
    },
    {
      number: 2,
      title: "Карточки обследования",
      description: "Создание и ведение карточек обследования пунктов",
      image: "/card_for_homik.png",
      features: ["Удобное заполнение", "История изменений", "Прикрепление фото"]
    },
    {
      number: 3,
      title: "Отчеты",
      description: "Формирование отчетов по результатам обследования",
      image: "/word_for_homik.png",
      features: ["Автоматическая генерация", "Различные форматы", "Статистика"]
    }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.innerContent}>
        <div className={styles.rightContent}>
          {features.map((feature) => (
            <motion.section
              key={feature.number}
              className={styles.section}
              viewport={{ once: false, amount: 0.5 }}
              initial={{ opacity: 0, x: 200, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -200, y: -50 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                x: { type: "spring", stiffness: 80, damping: 15 }
              }}
            >
              <motion.div
                className={styles.sectionContent}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={styles.content}>
                  <div className={styles.stepNumber}>{feature.number}</div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {feature.title}
                  </motion.h2>
                  <motion.p
                    className={styles.description}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>
                  <ul className={styles.featuresList}>
                    {feature.features.map((featureItem, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + featureIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {featureItem}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className={styles.imageContainer}>
                  <img src={feature.image} alt={feature.title} className={styles.featureImage} />
                </div>
              </motion.div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedFeatures; 