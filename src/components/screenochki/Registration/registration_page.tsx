import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './registration_page.module.css';
import { api, RegistrationData } from '../../../services/api';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    const response = await api.register(formData);

    if (response.error) {
      setError(response.error);
    } else {
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.registrationForm}>
        <h2 className={styles.title}>Регистрация</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <p className={styles.loginLink}>
            Уже есть аккаунт?{' '}
            <button
              type="button"
              className={styles.Loginlinkbutton}
              onClick={() => navigate('/login')}
            >
              Войти
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
