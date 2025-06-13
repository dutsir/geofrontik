import React from 'react';
import './AuthStatus.css';

interface AuthStatusProps {
  isAuthenticated: boolean;
  user?: {
    email: string;
    role: string;
  };
  onLogin: () => void;
  onLogout: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ isAuthenticated, user, onLogin, onLogout }) => {
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="auth-status">
      {isAuthenticated && user ? (
        <div className="user-info">
          <div className="user-avatar">
            {getInitials(user.email)}
          </div>
          <div className="user-details">
            <span className="user-email">{user.email}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      ) : (
        <button className="login-button" onClick={onLogin}>
          Войти
        </button>
      )}
    </div>
  );
};

export default AuthStatus; 