import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import AuthStatus from "../AuthStatus/AuthStatus";

interface HeaderochekProps {
  userRole?: string;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const Headerochek: React.FC<HeaderochekProps> = ({ userRole, isAuthenticated, userEmail, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.logoSection}>
          
          </div>
          
          <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
            <Link to="/" className={styles.navLink} onClick={closeMenu}>
              Главная
            </Link>
            <Link to="/map" className={styles.navLink} onClick={closeMenu}>
              Карта
            </Link>
            <Link to="/survey" className={styles.navLink} onClick={closeMenu}>
              Заполнить карточку
            </Link>
            <Link to="/admin" className={styles.navLink} onClick={closeMenu}>
              Админ панель
            </Link>
          </div>

          <div className={styles.menuToggle} onClick={toggleMenu}>
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className={styles.authContainer}>
            <AuthStatus 
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              userRole={userRole}
              onLogout={onLogout}
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Headerochek;
  