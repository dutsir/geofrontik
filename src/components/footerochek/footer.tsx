import React from "react";
import styles from "./footer.module.css";

const Footerochek: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Геодезическая система. 
          </p>
          <div className={styles.links}>
            <a href="https://t.me/yul228" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Связаться с нами
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footerochek;
