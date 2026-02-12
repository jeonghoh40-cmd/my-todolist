import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, ApiError } from '../api/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
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
      newErrors.username = '사용자명을 입력해주세요';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
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
          setErrors({ general: '아이디 또는 비밀번호가 일치하지 않습니다' });
          setFormData((prev) => ({ ...prev, password: '' }));
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: '서버 오류가 발생했습니다' });
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
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '32px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#202124',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          my-todolist
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5f6368',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          간편한 할일 관리 서비스
        </p>

        <h2 style={{
          fontSize: '22px',
          fontWeight: '500',
          color: '#202124',
          marginBottom: '24px',
        }}>
          로그인
        </h2>

        {errors.general && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fce8e6',
            color: '#d93025',
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
              color: '#202124',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              Username
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
                border: errors.username ? '2px solid #d93025' : '1px solid #dadce0',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
              }}
              onFocus={(e) => {
                if (!errors.username) {
                  e.target.style.border = '2px solid #1a73e8';
                }
              }}
              onBlur={(e) => {
                if (!errors.username) {
                  e.target.style.border = '1px solid #dadce0';
                }
              }}
            />
            {errors.username && (
              <p style={{ color: '#d93025', fontSize: '12px', marginTop: '4px' }}>
                {errors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '14px',
              color: '#202124',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              Password
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
                border: errors.password ? '2px solid #d93025' : '1px solid #dadce0',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.border = '2px solid #1a73e8';
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.border = '1px solid #dadce0';
                }
              }}
            />
            {errors.password && (
              <p style={{ color: '#d93025', fontSize: '12px', marginTop: '4px' }}>
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
              backgroundColor: isLoading ? '#9aa0a6' : '#1a73e8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {isLoading ? '처리 중...' : '로그인'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#5f6368',
          }}>
            계정이 없으신가요?{' '}
            <Link to="/register" style={{
              color: '#1a73e8',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
