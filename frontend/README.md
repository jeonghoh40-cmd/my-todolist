# Frontend - my-todolist

React 19 + TypeScript + Vite로 구성된 할일 관리 애플리케이션 프론트엔드

## Clean Architecture 구현

이 프론트엔드는 클린 아키텍처 원칙을 따르도록 설계되었습니다. 도메인, 애플리케이션, 인프라, 프레젠테이션 계층으로 구성되어 있으며, 관심사 분리를 통해 유지보수성과 테스트 용이성을 향상시켰습니다.

## 기술 스택

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.3.1
- React Router DOM 7.13.0
- Axios 1.13.5

## 프로젝트 구조

```
frontend/
├── src/
│   ├── pages/              # 라우팅되는 페이지
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── TodoList.tsx
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   └── PrivateRoute.tsx
│   ├── contexts/          # React Context
│   │   └── AuthContext.tsx
│   ├── hooks/             # 커스텀 훅
│   ├── api/               # API 호출 함수
│   ├── types/             # TypeScript 타입 정의
│   │   ├── auth.ts
│   │   ├── todo.ts
│   │   └── api.ts
│   ├── styles/            # 전역 스타일
│   ├── App.tsx            # 루트 컴포넌트
│   ├── main.tsx           # 진입점
│   └── index.css          # 전역 CSS
├── public/
├── .env                   # 환경 변수
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 환경 변수 설정

`.env` 파일 생성:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 http://localhost:5173 에서 실행됩니다.

### 3. 빌드

```bash
npm run build
```

### 4. 프리뷰

```bash
npm run preview
```

## 라우팅 구조

| 경로 | 컴포넌트 | 설명 | 인증 필요 |
|------|----------|------|-----------|
| `/` | RootRedirect | 인증 여부에 따라 /todos 또는 /login으로 리다이렉트 | - |
| `/login` | Login | 로그인 페이지 | X |
| `/register` | Register | 회원가입 페이지 | X |
| `/todos` | TodoList | 할일 목록 페이지 | O |

## 인증 관리

### AuthContext

전역 인증 상태 관리를 위한 Context API 사용:

- `user`: 현재 로그인한 사용자 정보
- `token`: JWT 토큰
- `isAuthenticated`: 인증 여부
- `login(token, user)`: 로그인 처리
- `logout()`: 로그아웃 처리

### PrivateRoute

인증이 필요한 페이지를 보호하는 컴포넌트. 미인증 사용자는 `/login`으로 리다이렉트됩니다.

## TypeScript 타입

### auth.ts
- `User`: 사용자 정보
- `RegisterRequest`: 회원가입 요청
- `LoginRequest`: 로그인 요청
- `LoginResponse`: 로그인 응답
- `AuthContextState`: AuthContext 상태

### todo.ts
- `Todo`: 할일 정보
- `CreateTodoRequest`: 할일 생성 요청
- `UpdateTodoRequest`: 할일 수정 요청

### api.ts
- `ApiError`: API 에러 응답
- `ApiResponse<T>`: API 응답 래퍼

## 개발 현황

### 완료된 작업 (Task 4.1)

- [x] Vite React TypeScript 프로젝트 초기화
- [x] 필요한 패키지 설치 (react-router-dom, axios)
- [x] 디렉토리 구조 생성
- [x] .env 파일 생성 및 설정
- [x] TypeScript 타입 정의 (auth.ts, todo.ts, api.ts)
- [x] AuthContext 구현 (localStorage 토큰 관리)
- [x] PrivateRoute 인증 가드 구현
- [x] React Router 설정
- [x] 임시 페이지 생성 (Login, Register, TodoList)
- [x] TypeScript 컴파일 에러 0건
- [x] 개발 서버 정상 실행 확인

### 다음 단계 (Task 4.2)

- [ ] API 유틸리티 개발 (src/api/api.ts)
- [ ] 회원가입 페이지 UI 구현
- [ ] 로그인 페이지 UI 구현
- [ ] 할일 목록 페이지 UI 구현

## 주의사항

- 백엔드 서버가 http://localhost:3000 에서 실행 중이어야 합니다
- JWT 토큰은 localStorage에 저장됩니다
- 인증이 필요한 페이지는 PrivateRoute로 보호됩니다
