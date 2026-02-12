# Frontend - my-todolist

React 19 + TypeScript + Vite 기반 할일 관리 애플리케이션 프론트엔드

## 📋 목차
- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [주요 컴포넌트](#주요-컴포넌트)
- [API 통신](#api-통신)
- [상태 관리](#상태-관리)
- [라우팅](#라우팅)
- [스타일링](#스타일링)
- [개발 가이드라인](#개발-가이드라인)
- [트러블슈팅](#트러블슈팅)

---

## 프로젝트 개요

my-todolist의 프론트엔드는 사용자가 할일을 관리할 수 있는 직관적인 웹 인터페이스를 제공합니다.

### 주요 기능
- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 할일 CRUD (생성, 조회, 수정, 삭제)
- ✅ 할일 완료 상태 토글
- ✅ 마감일 설정
- ✅ 반응형 디자인 (Mobile/Tablet/Desktop)
- ✅ Google Calendar 스타일 UI

---

## 기술 스택

### Core
- **React** 19.2.0 - UI 라이브러리
- **TypeScript** ~5.9.3 - 타입 안정성
- **Vite** 7.3.1 - 빌드 도구 및 개발 서버

### 라이브러리
- **React Router DOM** 7.13.0 - SPA 라우팅
- **Axios** 1.13.5 - HTTP 클라이언트

### 개발 도구
- **ESLint** 9.39.1 - 코드 품질 검사
- **TypeScript ESLint** 8.48.0 - TypeScript 린팅

---

## 프로젝트 구조

```
frontend/
├── .env                      # 환경 변수 (gitignore)
├── .env.example              # 환경 변수 템플릿
├── package.json              # 의존성 및 스크립트
├── vite.config.ts            # Vite 설정
├── tsconfig.json             # TypeScript 설정
├── index.html                # HTML 진입점
│
└── src/
    ├── main.tsx              # 애플리케이션 진입점
    ├── App.tsx               # 루트 컴포넌트 (라우팅)
    ├── index.css             # 전역 스타일
    │
    ├── api/
    │   └── api.ts            # API 통신 유틸리티
    │
    ├── components/           # 재사용 가능한 컴포넌트
    │   ├── PrivateRoute.tsx  # 인증 가드
    │   ├── TodoItem.tsx      # 할일 카드
    │   ├── TodoForm.tsx      # 할일 추가/수정 모달
    │   ├── ConfirmDialog.tsx # 삭제 확인 다이얼로그
    │   └── LoadingSpinner.tsx # 로딩 스피너
    │
    ├── contexts/             # React Context
    │   └── AuthContext.tsx   # 인증 상태 관리
    │
    ├── pages/                # 페이지 컴포넌트
    │   ├── Login.tsx         # 로그인 페이지
    │   ├── Register.tsx      # 회원가입 페이지
    │   └── TodoList.tsx      # 할일 목록 페이지
    │
    ├── types/                # TypeScript 타입 정의
    │   ├── auth.ts           # 인증 관련 타입
    │   ├── todo.ts           # 할일 관련 타입
    │   └── api.ts            # API 관련 타입
    │
    └── styles/               # 스타일 파일
        └── TodoList.css      # 할일 목록 스타일
```

---

## 시작하기

### 1. 환경 설정

`.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 내용:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버: http://localhost:5173 (포트가 사용 중이면 자동으로 다른 포트 할당)

### 4. 빌드

```bash
npm run build
```

빌드 결과물: `dist/` 디렉토리

### 5. 프리뷰

```bash
npm run preview
```

---

## 주요 컴포넌트

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

전역 인증 상태 관리

**제공하는 기능:**
- `user`: 현재 로그인한 사용자 정보
- `token`: JWT 토큰
- `isAuthenticated`: 인증 여부
- `login(token, user)`: 로그인 처리
- `logout()`: 로그아웃 처리

**사용 예시:**
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>환영합니다, {user?.username}님!</p>}
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
```

**내부 동작:**
- localStorage에 토큰 저장/복원
- 페이지 새로고침 시 자동 로그인
- 로그아웃 시 localStorage 정리

---

### 2. PrivateRoute (`src/components/PrivateRoute.tsx`)

인증이 필요한 라우트 보호

**사용 예시:**
```tsx
<Route
  path="/todos"
  element={
    <PrivateRoute>
      <TodoList />
    </PrivateRoute>
  }
/>
```

**동작:**
- 미인증 시 `/login`으로 리다이렉트
- 인증된 경우 children 렌더링

---

### 3. TodoItem (`src/components/TodoItem.tsx`)

개별 할일 카드

**Props:**
```tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (todoId: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}
```

**기능:**
- 완료 체크박스
- 제목, 설명, 마감일 표시
- 완료 시 취소선 + 회색 배경
- 수정/삭제 버튼

---

### 4. TodoForm (`src/components/TodoForm.tsx`)

할일 추가/수정 모달

**Props:**
```tsx
interface TodoFormProps {
  initialData?: Todo | null;
  onSubmit: (data: CreateTodoRequest | UpdateTodoRequest) => Promise<void>;
  onCancel: () => void;
}
```

**기능:**
- 제목 (필수)
- 설명 (선택)
- 마감일 (선택, HTML5 date input)
- 폼 검증 (제목 필수)
- ESC 키 / 오버레이 클릭으로 닫기

---

### 5. ConfirmDialog (`src/components/ConfirmDialog.tsx`)

삭제 확인 다이얼로그

**Props:**
```tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  todo: Todo | null;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**기능:**
- 할일 제목 표시
- 취소 / 삭제 버튼
- ESC 키로 닫기

---

## API 통신

### API 유틸리티 (`src/api/api.ts`)

**환경 변수:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

**인증 API:**
```typescript
// 회원가입
authAPI.register(username, password, email)
  → Promise<LoginResponse>

// 로그인
authAPI.login(username, password)
  → Promise<LoginResponse>
```

**할일 API:**
```typescript
// 할일 목록 조회
todoAPI.getTodos(token)
  → Promise<Todo[]>

// 할일 추가
todoAPI.createTodo(token, data)
  → Promise<Todo>

// 할일 수정
todoAPI.updateTodo(token, todoId, data)
  → Promise<Todo>

// 할일 삭제
todoAPI.deleteTodo(token, todoId)
  → Promise<void>

// 완료 상태 토글
todoAPI.toggleComplete(token, todoId)
  → Promise<Todo>
```

**에러 처리:**
```typescript
try {
  const response = await authAPI.login(username, password);
  // 성공 처리
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code);    // 'E-002'
    console.error(error.message); // '아이디 또는 비밀번호가 일치하지 않습니다'
  }
}
```

**에러 코드:**
- `E-001`: 중복 username
- `E-002`: 잘못된 자격증명
- `E-003`: 이메일 형식 오류
- `E-101`: 인증 필요
- `E-102`: 접근 권한 없음
- `E-103`: 제목 필수
- `E-104`: 할일을 찾을 수 없음

---

## 상태 관리

### AuthContext (전역 상태)

**저장 위치:** localStorage

**저장 데이터:**
```typescript
{
  token: string,      // JWT 토큰
  user: {             // 사용자 정보
    id: number,
    username: string,
    email: string,
    createdAt: string
  }
}
```

**초기화 로직:**
```typescript
// 페이지 로드 시 localStorage에서 복원
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }
}, []);
```

### 로컬 상태 (페이지별)

각 페이지는 `useState`로 로컬 상태 관리:
- 폼 데이터
- 로딩 상태
- 에러 메시지
- 모달 표시 여부

---

## 라우팅

### 라우트 구조

```tsx
<Routes>
  {/* 루트: 인증 여부에 따라 리다이렉트 */}
  <Route path="/" element={<RootRedirect />} />

  {/* 공개 라우트 */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* 보호된 라우트 */}
  <Route
    path="/todos"
    element={
      <PrivateRoute>
        <TodoList />
      </PrivateRoute>
    }
  />
</Routes>
```

### RootRedirect 로직

```tsx
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/todos' : '/login'} replace />;
}
```

**동작:**
- 인증된 경우: `/todos`로 이동
- 미인증: `/login`으로 이동

---

## 스타일링

### 색상 시스템 (Google Calendar 스타일)

**CSS 변수** (`src/index.css`):
```css
:root {
  /* Primary */
  --primary-blue: #1a73e8;
  --primary-blue-hover: #1765cc;
  --primary-blue-light: #e8f0fe;

  /* Status */
  --success-green: #188038;
  --success-green-light: #e6f4ea;
  --danger-red: #d93025;
  --danger-red-light: #fce8e6;

  /* Neutral */
  --bg-white: #ffffff;
  --bg-gray: #f1f3f4;
  --text-primary: #202124;
  --text-secondary: #5f6368;
}
```

### 반응형 브레이크포인트

```css
/* Mobile (기본) */
@media (max-width: 767px) {
  .todo-grid { grid-template-columns: 1fr; }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .todo-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .todo-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .todo-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### 애니메이션

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## 개발 가이드라인

### 1. 컴포넌트 작성

**원칙:**
- 하나의 컴포넌트는 하나의 책임만
- Props 타입은 명시적으로 정의
- 재사용 가능하도록 설계

**예시:**
```tsx
interface MyComponentProps {
  title: string;
  onSave: (data: SomeData) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onSave }) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

### 2. 상태 관리

**로컬 상태:**
```tsx
const [formData, setFormData] = useState({ title: '', description: '' });
```

**전역 상태:**
```tsx
const { user, login, logout } = useAuth();
```

### 3. API 호출

**패턴:**
```tsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async () => {
  setIsLoading(true);
  setError('');

  try {
    const result = await someAPI.call();
    // 성공 처리
  } catch (err) {
    if (err instanceof ApiError) {
      setError(err.message);
    }
  } finally {
    setIsLoading(false);
  }
};
```

### 4. 에러 처리

**폼 검증:**
```tsx
const [errors, setErrors] = useState<{ [key: string]: string }>({});

const validate = () => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.title) {
    newErrors.title = '제목은 필수입니다';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**API 에러:**
```tsx
catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'E-001':
        setErrors({ username: '이미 존재하는 사용자명입니다' });
        break;
      case 'E-002':
        setError('아이디 또는 비밀번호가 일치하지 않습니다');
        break;
      default:
        setError(error.message);
    }
  }
}
```

### 5. TypeScript 활용

**타입 가드:**
```tsx
if (todo.due_date) {
  // due_date는 string | null이지만, 여기서는 string
}
```

**제네릭:**
```tsx
interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
```

---

## 트러블슈팅

### 문제: CORS 에러

**증상:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/login'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**해결:**
1. 백엔드 `server.js`에서 CORS 설정 확인:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

2. 프론트엔드 `.env` 파일 확인:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

### 문제: 로그인 후 새로고침 시 로그아웃

**원인:** localStorage에 토큰이 저장되지 않음

**해결:**
1. AuthContext의 `login` 함수 확인:
```tsx
const login = (token: string, user: User) => {
  setToken(token);
  setUser(user);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
```

2. 브라우저 개발자 도구 → Application → Local Storage 확인

---

### 문제: API 호출 시 401 Unauthorized

**원인:** 토큰이 만료되었거나 유효하지 않음

**해결:**
1. 로그아웃 후 재로그인
2. localStorage 확인:
```javascript
localStorage.getItem('token')
```

3. 토큰 디코딩 (JWT 디버거 사용):
```
https://jwt.io/
```

---

### 문제: 환경 변수가 적용되지 않음

**원인:** Vite 환경 변수는 `VITE_` 접두사 필요

**해결:**
1. `.env` 파일:
```env
VITE_API_BASE_URL=http://localhost:3000/api  ✅
API_BASE_URL=http://localhost:3000/api       ❌
```

2. 코드에서 사용:
```typescript
import.meta.env.VITE_API_BASE_URL  ✅
process.env.API_BASE_URL           ❌
```

3. 서버 재시작 필요 (환경 변수 변경 시)

---

### 문제: 빌드 에러 (TypeScript)

**증상:**
```
error TS2339: Property 'xxx' does not exist on type 'yyy'
```

**해결:**
1. 타입 정의 확인:
```tsx
interface Todo {
  id: number;
  title: string;
  // ...
}
```

2. 옵셔널 체이닝 사용:
```tsx
todo.due_date?.toString()  // due_date가 null일 수 있음
```

3. 타입 검사:
```bash
npx tsc --noEmit
```

---

## 유용한 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 프리뷰
npm run preview

# 린트 검사
npm run lint

# TypeScript 타입 검사
npx tsc --noEmit

# 의존성 업데이트
npm update

# 의존성 취약점 검사
npm audit
```

---

## 참고 문서

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [React Router 공식 문서](https://reactrouter.com/)
- [Axios 공식 문서](https://axios-http.com/)

---

## 라이선스

이 프로젝트는 MVP 개발 목적으로 작성되었습니다.
