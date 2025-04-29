import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import styles from './login_page.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.login({ email, password });
      
      if (response.success) {
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 100);
      } else {
        setError(response.error || 'Ошибка при входе. Попробуйте еще раз.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка подключения к серверу. Проверьте соединение и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <h2 className={styles.title}>Вход в систему</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
          <p className={styles.registerLink}>
            Нет аккаунта?{' '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate('/registration')}
              disabled={isLoading}
            >
              Зарегистрироваться
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
