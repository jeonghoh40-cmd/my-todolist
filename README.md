# my-todolist

간단하고 직관적인 할일 관리 웹 애플리케이션

## 📋 프로젝트 소개

my-todolist는 사용자가 할일을 효율적으로 관리할 수 있는 웹 애플리케이션입니다. 회원가입, 로그인, 할일 CRUD, 완료 상태 관리 등의 핵심 기능을 제공합니다.

### 주요 기능

- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 할일 CRUD (생성, 조회, 수정, 삭제)
- ✅ 할일 완료 상태 토글
- ✅ 마감일 설정 및 관리
- ✅ 반응형 디자인 (Mobile/Tablet/Desktop)
- ✅ Google Calendar 스타일 UI

## 🛠 기술 스택

### 백엔드
- **Node.js** + **Express** - 서버 프레임워크
- **PostgreSQL 17** - 데이터베이스
- **pg** - PostgreSQL 클라이언트 라이브러리
- **JWT** - 인증 토큰 (24시간 유효기간)
- **bcrypt** - 비밀번호 암호화 (cost factor 10)

### 프론트엔드
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 및 개발 서버
- **React Router DOM** - SPA 라우팅

### 개발 도구
- **ESLint** - 코드 품질 검사
- **Nodemon** - 백엔드 자동 재시작
- **Swagger UI** - API 문서화

## 📦 설치 방법

### 1. 사전 요구사항

- **Node.js** 18+ (권장: 20 LTS)
- **PostgreSQL** 17
- **npm** 또는 **yarn**

### 2. 저장소 클론

```bash
git clone <repository-url>
cd my-todolist
```

### 3. 데이터베이스 설정

PostgreSQL에 접속하여 데이터베이스 생성:

```bash
psql -U postgres
```

```sql
CREATE DATABASE my_todolist;
\c my_todolist
```

스키마 생성:

```bash
cd backend
psql -U postgres -d my_todolist -f src/db/schema.sql
```

### 4. 백엔드 설정

```bash
cd backend
npm install
```

`.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 수정:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_todolist
DB_USER=postgres
DB_PASSWORD=your_password

# JWT 설정
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# 서버 설정
PORT=3000
NODE_ENV=development
```

### 5. 프론트엔드 설정

```bash
cd ../frontend
npm install
```

`.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 수정:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚀 실행 방법

### 개발 환경 실행

#### 1. 백엔드 서버 실행

```bash
cd backend
npm run dev
```

- 서버: http://localhost:3000
- Health Check: http://localhost:3000/api/health
- API Docs: http://localhost:3000/api-docs

#### 2. 프론트엔드 개발 서버 실행

```bash
cd frontend
npm run dev
```

- 프론트엔드: http://localhost:5173 (또는 자동 할당된 포트)

### 프로덕션 빌드

#### 백엔드

```bash
cd backend
npm start
```

#### 프론트엔드

```bash
cd frontend
npm run build
npm run preview
```

빌드 결과물: `frontend/dist/`

## 📁 프로젝트 구조

```
my-todolist/
├── backend/                 # 백엔드 서버
│   ├── src/
│   │   ├── controllers/     # API 요청 핸들러
│   │   ├── routes/          # API 라우팅
│   │   ├── middleware/      # 미들웨어 (인증 등)
│   │   ├── models/          # 데이터베이스 모델
│   │   ├── services/        # 비즈니스 로직
│   │   ├── utils/           # 유틸리티 함수
│   │   ├── db/              # 데이터베이스 설정
│   │   └── server.js        # 서버 진입점
│   ├── .env                 # 환경 변수
│   └── package.json
│
├── frontend/                # 프론트엔드 앱
│   ├── src/
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── components/      # 재사용 컴포넌트
│   │   ├── contexts/        # React Context
│   │   ├── api/             # API 통신
│   │   ├── types/           # TypeScript 타입
│   │   └── App.tsx
│   ├── .env                 # 환경 변수
│   └── package.json
│
├── docs/                    # 프로젝트 문서
│   ├── 1-domain-definition.md
│   ├── 2-prd.md
│   ├── 7-execution-plan.md
│   ├── 10-e2e-test-guide.md
│   └── ...
│
└── README.md                # 이 파일
```

## 🔑 주요 API 엔드포인트

### 인증 (Authentication)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |

### 할일 (Todos)

| 메서드 | 엔드포인트 | 설명 | 인증 필요 |
|--------|-----------|------|----------|
| GET | `/api/todos` | 할일 목록 조회 | ✅ |
| POST | `/api/todos` | 할일 추가 | ✅ |
| PUT | `/api/todos/:id` | 할일 수정 | ✅ |
| DELETE | `/api/todos/:id` | 할일 삭제 | ✅ |
| PATCH | `/api/todos/:id/complete` | 완료 상태 토글 | ✅ |

자세한 API 문서는 [backend/README.md](./backend/README.md) 또는 http://localhost:3000/api-docs 참조

## 🧪 테스트

### E2E 테스트

E2E 테스트 가이드는 [docs/10-e2e-test-guide.md](./docs/10-e2e-test-guide.md)를 참조하세요.

#### 빠른 테스트 절차

1. 서버 실행 확인
2. 브라우저에서 http://localhost:5173 접속
3. 회원가입 → 로그인 → 할일 CRUD 테스트

### 코드 품질 검사

#### 프론트엔드

```bash
cd frontend
npm run lint          # ESLint 검사
npx tsc --noEmit      # TypeScript 타입 체크
```

## 🔐 보안

- ✅ **비밀번호 암호화**: bcrypt (cost factor 10)
- ✅ **JWT 인증**: 24시간 유효기간
- ✅ **SQL Injection 방어**: 파라미터화된 쿼리
- ✅ **XSS 방어**: React의 자동 이스케이핑
- ✅ **CORS 설정**: 허용된 origin만 접근

## 📱 반응형 디자인

### 브레이크포인트

- **모바일**: < 768px (1열)
- **태블릿**: 768px ~ 1023px (2열)
- **데스크톱**: 1024px ~ 1279px (2열)
- **대형 데스크톱**: 1280px+ (3열)

## 🎨 UI/UX

- **디자인 시스템**: Google Calendar 스타일
- **색상**:
  - Primary Blue: #1a73e8
  - Success Green: #188038
  - Danger Red: #d93025
- **폰트**: 시스템 폰트 스택

## 📚 문서

- [PRD (제품 요구사항)](./docs/2-prd.md)
- [실행 계획](./docs/7-execution-plan.md)
- [E2E 테스트 가이드](./docs/10-e2e-test-guide.md)
- [백엔드 README](./backend/README.md)
- [프론트엔드 CLAUDE.md](./frontend/CLAUDE.md)

## 🐛 트러블슈팅

### CORS 에러

**문제**: `Access to XMLHttpRequest has been blocked by CORS policy`

**해결**:
1. 백엔드 서버 실행 확인
2. `backend/src/server.js`의 CORS 설정 확인
3. 프론트엔드 포트와 백엔드 CORS origin 일치 확인

### 데이터베이스 연결 실패

**문제**: `Failed to connect to database`

**해결**:
1. PostgreSQL 서버 실행 확인: `psql --version`
2. `.env` 파일의 DB 설정 확인
3. 데이터베이스 생성 확인: `psql -U postgres -l | grep my_todolist`

### 포트 충돌

**문제**: `Port 3000 is already in use`

**해결**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

또는 `.env` 파일에서 포트 변경

## 📝 라이선스

이 프로젝트는 MVP 개발 목적으로 작성되었습니다.

## 👨‍💻 개발 정보

- **MVP 출시일**: 2026-02-14
- **개발 기간**: 3일
- **개발 원칙**: 간단하게, 빠르게, 동작하는 제품

---

**문의**: 문제가 발생하면 [Issues](./docs/10-e2e-test-guide.md#트러블슈팅)를 참조하거나 이슈를 등록해주세요.
