import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define available languages
export type Language = 'ko' | 'en';

// Define translation keys
export interface Translations {
  // Common
  appName: string;
  description: string;
  username: string;
  password: string;
  email: string;
  login: string;
  register: string;
  logout: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  title: string;
  descriptionLabel: string;
  dueDate: string;
  completed: string;
  incomplete: string;
  addTodo: string;
  myTodos: string;
  hello: string;
  welcome: string;
  success: string;
  todo: string;
  todoLoadError: string;
  todoAddError: string;
  todoUpdateError: string;
  todoDeleteError: string;
  todoToggleError: string;
  noTodos: string;
  addNewTodo: string;
  
  // Errors
  requiredField: string;
  invalidEmail: string;
  usernameTaken: string;
  invalidCredentials: string;
  serverError: string;
  titleRequired: string;
  deleteConfirmation: string;
  cannotUndo: string;
  loading: string;
  
  // Pages
  loginPage: string;
  registerPage: string;
  todoListPage: string;
  
  // Placeholders
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  emailPlaceholder: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  dueDatePlaceholder: string;
}

// Korean translations
const koTranslations: Translations = {
  // Common
  appName: 'my-todolist',
  description: '간편한 할일 관리 서비스',
  username: '사용자명',
  password: '비밀번호',
  email: '이메일',
  login: '로그인',
  register: '회원가입',
  logout: '로그아웃',
  cancel: '취소',
  save: '저장',
  delete: '삭제',
  edit: '수정',
  title: '제목',
  descriptionLabel: '설명',
  dueDate: '마감일',
  completed: '완료됨',
  incomplete: '미완료',
  addTodo: '할일 추가',
  myTodos: '나의 할일 목록',
  hello: '님',
  welcome: '환영합니다',
  success: '성공!',
  todo: '할일',
  todoLoadError: '할일 목록을 불러오는 데 실패했습니다',
  todoAddError: '할일 추가에 실패했습니다',
  todoUpdateError: '할일 수정에 실패했습니다',
  todoDeleteError: '할일 삭제에 실패했습니다',
  todoToggleError: '할일 상태 변경에 실패했습니다',
  noTodos: '할일이 없습니다.',
  addNewTodo: '새로운 할일을 추가해보세요!',
  
  // Errors
  requiredField: '을(를) 입력해주세요',
  invalidEmail: '올바른 이메일 형식이 아닙니다',
  usernameTaken: '이미 존재하는 사용자명입니다',
  invalidCredentials: '아이디 또는 비밀번호가 일치하지 않습니다',
  serverError: '서버 오류가 발생했습니다',
  titleRequired: '할일 제목은 필수 항목입니다',
  deleteConfirmation: '정말 삭제하시겠습니까?',
  cannotUndo: '이 작업은 취소할 수 없습니다.',
  loading: '로딩 중...',
  
  // Pages
  loginPage: '로그인',
  registerPage: '회원가입',
  todoListPage: '할일 목록',
  
  // Placeholders
  usernamePlaceholder: '사용자명을 입력하세요',
  passwordPlaceholder: '비밀번호를 입력하세요',
  emailPlaceholder: '이메일을 입력하세요',
  titlePlaceholder: '제목을 입력하세요',
  descriptionPlaceholder: '설명을 입력하세요',
  dueDatePlaceholder: '마감일을 선택하세요',
};

// English translations
const enTranslations: Translations = {
  // Common
  appName: 'my-todolist',
  description: 'Simple To-do Management Service',
  username: 'Username',
  password: 'Password',
  email: 'Email',
  login: 'Login',
  register: 'Register',
  logout: 'Logout',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  title: 'Title',
  descriptionLabel: 'Description',
  dueDate: 'Due Date',
  completed: 'Completed',
  incomplete: 'Incomplete',
  addTodo: 'Add Todo',
  myTodos: 'My Todo List',
  hello: ', Hello',
  welcome: 'Welcome',
  success: 'Success!',
  todo: 'Todo',
  todoLoadError: 'Failed to load todo list',
  todoAddError: 'Failed to add todo',
  todoUpdateError: 'Failed to update todo',
  todoDeleteError: 'Failed to delete todo',
  todoToggleError: 'Failed to toggle todo status',
  noTodos: 'No todos yet.',
  addNewTodo: 'Add a new todo!',
  
  // Errors
  requiredField: ' is required',
  invalidEmail: 'Invalid email format',
  usernameTaken: 'Username already exists',
  invalidCredentials: 'Incorrect username or password',
  serverError: 'A server error occurred',
  titleRequired: 'Title is required',
  deleteConfirmation: 'Are you sure you want to delete?',
  cannotUndo: 'This action cannot be undone.',
  loading: 'Loading...',
  
  // Pages
  loginPage: 'Login',
  registerPage: 'Register',
  todoListPage: 'Todo List',
  
  // Placeholders
  usernamePlaceholder: 'Enter username',
  passwordPlaceholder: 'Enter password',
  emailPlaceholder: 'Enter email',
  titlePlaceholder: 'Enter title',
  descriptionPlaceholder: 'Enter description',
  dueDatePlaceholder: 'Select due date',
};

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check for saved language preference or default to browser language
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['ko', 'en'].includes(savedLang)) {
      return savedLang;
    }
    
    // Default to Korean if browser language starts with ko, otherwise English
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('ko') ? 'ko' : 'en';
  });

  const translations = language === 'ko' ? koTranslations : enTranslations;

  const value = {
    language,
    translations,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};