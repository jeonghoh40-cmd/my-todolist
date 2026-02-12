import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, ApiError } from '../api/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authAPI.register(formData);
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'E-001') {
          setErrors({ username: '이미 존재하는 사용자명입니다' });
        } else if (error.code === 'E-003') {
          setErrors({ email: '올바른 이메일 형식이 아닙니다' });
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
          회원가입
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

          <div style={{ marginBottom: '20px' }}>
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

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '14px',
              color: '#202124',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 12px',
                border: errors.email ? '2px solid #d93025' : '1px solid #dadce0',
                borderRadius: '4px',
                fontSize: '16px',
                outline: 'none',
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.border = '2px solid #1a73e8';
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.border = '1px solid #dadce0';
                }
              }}
            />
            {errors.email && (
              <p style={{ color: '#d93025', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
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
            {isLoading ? '처리 중...' : '회원가입'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#5f6368',
          }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{
              color: '#1a73e8',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
