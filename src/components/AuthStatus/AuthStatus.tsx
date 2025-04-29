import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStatus.css';

interface AuthStatusProps {
  isAuthenticated: boolean;
  userEmail?: string;
  userRole?: string;
  onLogout: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ isAuthenticated, userEmail, userRole, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthStatus props:', { isAuthenticated, userEmail, userRole });
  }, [isAuthenticated, userEmail, userRole]);

  const handleLogin = () => {
    navigate('/login');
  };

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (isAuthenticated && userEmail) {
    return (
      <div className="auth-status">
        <div className="user-info">
          <div className="user-avatar" title={userEmail}>
            {getInitial(userEmail)}
          </div>
          <div className="user-details">
            <span className="user-email">{userEmail}</span>
            {userRole && <span className="user-role">{userRole}</span>}
          </div>
          <button className="logout-button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-status">
      <button className="login-button" onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
};

export default AuthStatus; 