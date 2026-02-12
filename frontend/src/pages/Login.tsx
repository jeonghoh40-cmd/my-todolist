import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { authAPI, ApiError } from '../api/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Clear form data when component mounts or when user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setFormData({
        username: '',
        password: '',
      });
      setErrors({});
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = `${translations.username}${translations.requiredField}`;
    }

    if (!formData.password.trim()) {
      newErrors.password = `${translations.password}${translations.requiredField}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login(formData);
      login(response.token, response.user);
      navigate('/todos');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'E-002') {
          setErrors({ general: translations.invalidCredentials });
          setFormData((prev) => ({ ...prev, password: '' }));
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: translations.serverError });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'var(--bg-gray)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--surface)',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '32px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          {translations.appName}
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          {translations.description}
        </p>

        <h2 style={{
          fontSize: '22px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          {translations.loginPage}
        </h2>

        {errors.general && (
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--danger-red-light)',
            color: 'var(--danger-red)',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              {translations.username}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 12px',
                border: errors.username ? '2px solid var(--danger-red)' : '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                if (!errors.username) {
                  e.target.style.border = '2px solid var(--primary-blue)';
                }
              }}
              onBlur={(e) => {
                if (!errors.username) {
                  e.target.style.border = '1px solid var(--border-light)';
                }
              }}
            />
            {errors.username && (
              <p style={{ color: 'var(--danger-red)', fontSize: '12px', marginTop: '4px' }}>
                {errors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              color: 'var(--text-primary)',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              {translations.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 12px',
                border: errors.password ? '2px solid var(--danger-red)' : '1px solid var(--border-light)',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'var(--bg-white)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.border = '2px solid var(--primary-blue)';
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.border = '1px solid var(--border-light)';
                }
              }}
            />
            {errors.password && (
              <p style={{ color: 'var(--danger-red)', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: isLoading ? 'var(--text-disabled)' : 'var(--primary-blue)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {isLoading ? translations.loading : translations.login}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            {translations.registerPage}?{' '}
            <Link to="/register" style={{
              color: 'var(--primary-blue)',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              {translations.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
