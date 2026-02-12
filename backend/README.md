# Backend - my-todolist API

Node.js + Express + PostgreSQL 기반 할일 관리 API 서버

## 📋 목차

- [개요](#개요)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [API 엔드포인트](#api-엔드포인트)
- [에러 코드](#에러-코드)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [프로젝트 구조](#프로젝트-구조)

---

## 개요

my-todolist의 백엔드 API 서버입니다. JWT 기반 인증과 할일 관리 기능을 제공합니다.

### 주요 기능

- ✅ JWT 기반 인증 (24시간 유효기간)
- ✅ bcrypt 비밀번호 암호화 (cost factor 10)
- ✅ 할일 CRUD API
- ✅ 사용자별 데이터 분리
- ✅ Swagger API 문서
- ✅ CORS 설정

---

## 기술 스택

- **Node.js** 18+
- **Express** 4.21.2 - 웹 프레임워크
- **pg** 8.13.1 - PostgreSQL 클라이언트 (⚠️ Prisma 사용 안 함)
- **jsonwebtoken** 9.0.2 - JWT 인증
- **bcrypt** 5.1.1 - 비밀번호 암호화
- **dotenv** 17.2.4 - 환경 변수 관리
- **cors** 2.8.5 - CORS 미들웨어
- **swagger-ui-express** 5.0.1 - API 문서화

---

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

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

### 3. 데이터베이스 초기화

```bash
psql -U postgres -d my_todolist -f src/db/schema.sql
```

### 4. 서버 실행

#### 개발 모드

```bash
npm run dev
```

#### 프로덕션 모드

```bash
npm start
```

### 5. 접속 확인

- **Health Check**: http://localhost:3000/api/health
- **API Docs**: http://localhost:3000/api-docs

---

## API 엔드포인트

### 인증 (Authentication)

#### 회원가입

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
```

**응답** (201 Created):
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2026-02-12T10:00:00.000Z"
  }
}
```

**에러**:
- `E-001` (409): 이미 존재하는 사용자명
- `E-003` (400): 유효하지 않은 이메일 형식

---

#### 로그인

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**응답** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2026-02-12T10:00:00.000Z"
  }
}
```

**에러**:
- `E-002` (401): 아이디 또는 비밀번호가 일치하지 않습니다

---

### 할일 (Todos)

⚠️ **모든 할일 API는 인증이 필요합니다** (Authorization 헤더 필수)

#### 할일 목록 조회

```http
GET /api/todos
Authorization: Bearer <token>
```

**응답** (200 OK):
```json
{
  "todos": [
    {
      "id": 1,
      "user_id": 1,
      "title": "할일 제목",
      "description": "할일 설명",
      "due_date": "2026-02-20",
      "is_completed": false,
      "created_at": "2026-02-12T10:00:00.000Z",
      "updated_at": "2026-02-12T10:00:00.000Z"
    }
  ]
}
```

**에러**:
- `E-101` (401): 인증이 필요합니다

---

#### 할일 추가

```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "새로운 할일",
  "description": "할일 설명 (선택)",
  "due_date": "2026-02-20" (선택)
}
```

**응답** (201 Created):
```json
{
  "todo": {
    "id": 2,
    "user_id": 1,
    "title": "새로운 할일",
    "description": "할일 설명",
    "due_date": "2026-02-20",
    "is_completed": false,
    "created_at": "2026-02-12T10:05:00.000Z",
    "updated_at": "2026-02-12T10:05:00.000Z"
  }
}
```

**에러**:
- `E-103` (400): 할일 제목은 필수 항목입니다

---

#### 할일 수정

```http
PUT /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "수정된 제목",
  "description": "수정된 설명",
  "due_date": "2026-02-25"
}
```

**응답** (200 OK):
```json
{
  "todo": {
    "id": 2,
    "user_id": 1,
    "title": "수정된 제목",
    "description": "수정된 설명",
    "due_date": "2026-02-25",
    "is_completed": false,
    "created_at": "2026-02-12T10:05:00.000Z",
    "updated_at": "2026-02-12T10:10:00.000Z"
  }
}
```

**에러**:
- `E-102` (403): 접근 권한이 없습니다
- `E-104` (404): 할일을 찾을 수 없습니다

---

#### 할일 삭제

```http
DELETE /api/todos/:id
Authorization: Bearer <token>
```

**응답** (204 No Content):
```
(본문 없음)
```

**에러**:
- `E-102` (403): 접근 권한이 없습니다
- `E-104` (404): 할일을 찾을 수 없습니다

---

#### 할일 완료 상태 토글

```http
PATCH /api/todos/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "is_completed": true
}
```

**응답** (200 OK):
```json
{
  "todo": {
    "id": 2,
    "user_id": 1,
    "title": "수정된 제목",
    "description": "수정된 설명",
    "due_date": "2026-02-25",
    "is_completed": true,
    "created_at": "2026-02-12T10:05:00.000Z",
    "updated_at": "2026-02-12T10:15:00.000Z"
  }
}
```

**에러**:
- `E-102` (403): 접근 권한이 없습니다
- `E-104` (404): 할일을 찾을 수 없습니다

---

## 에러 코드

| 코드 | HTTP 상태 | 메시지 | 설명 |
|------|----------|--------|------|
| E-001 | 409 | Username already exists | 이미 존재하는 사용자명 |
| E-002 | 401 | Invalid credentials | 아이디 또는 비밀번호 불일치 |
| E-003 | 400 | Invalid email format | 유효하지 않은 이메일 형식 |
| E-101 | 401 | Authentication required | 인증이 필요합니다 |
| E-102 | 403 | Access denied | 접근 권한이 없습니다 |
| E-103 | 400 | Title is required | 할일 제목은 필수 항목입니다 |
| E-104 | 404 | Todo not found | 할일을 찾을 수 없습니다 |

---

## 데이터베이스 스키마

### users 테이블

| 컬럼 | 타입 | 제약 조건 | 설명 |
|------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 사용자 ID |
| username | VARCHAR(50) | UNIQUE NOT NULL | 사용자명 |
| password | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 |
| email | VARCHAR(100) | NOT NULL | 이메일 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성일시 |

### todos 테이블

| 컬럼 | 타입 | 제약 조건 | 설명 |
|------|------|----------|------|
| id | SERIAL | PRIMARY KEY | 할일 ID |
| user_id | INTEGER | FOREIGN KEY (users.id) ON DELETE CASCADE | 사용자 ID |
| title | VARCHAR(255) | NOT NULL | 할일 제목 |
| description | TEXT | | 할일 설명 |
| due_date | DATE | | 마감일 |
| is_completed | BOOLEAN | DEFAULT false | 완료 여부 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 수정일시 |

### 인덱스

- `idx_todos_user_id` on `todos(user_id)`
- `idx_todos_is_completed` on `todos(is_completed)`

---

## 프로젝트 구조

```
backend/
├── src/
│   ├── controllers/          # API 요청 핸들러
│   │   ├── auth.controller.js
│   │   └── todos.controller.js
│   ├── routes/               # API 라우팅
│   │   ├── auth.routes.js
│   │   └── todos.routes.js
│   ├── middleware/           # 미들웨어
│   │   └── auth.middleware.js
│   ├── models/               # 데이터베이스 모델
│   │   ├── user.model.js
│   │   └── todo.model.js
│   ├── services/             # 비즈니스 로직
│   │   ├── auth.service.js
│   │   └── todos.service.js
│   ├── utils/                # 유틸리티 함수
│   │   ├── password.utils.js
│   │   └── jwt.utils.js
│   ├── db/                   # 데이터베이스 설정
│   │   ├── connection.js
│   │   └── schema.sql
│   └── server.js             # 서버 진입점
├── swagger/                  # API 문서
│   └── swagger.json
├── .env                      # 환경 변수
├── .gitignore
├── package.json
└── README.md                 # 이 파일
```

---

## 보안

### 비밀번호 암호화

- bcrypt 사용 (cost factor: 10)
- 평문 비밀번호는 저장하지 않음

### JWT 인증

- 토큰 유효기간: 24시간
- Secret Key: 환경 변수로 관리
- Authorization 헤더: `Bearer <token>` 형식

### SQL Injection 방어

- 파라미터화된 쿼리 사용
- pg 라이브러리의 자동 이스케이핑

---

## 개발 가이드

### 새 API 엔드포인트 추가

1. **Model 작성** (`src/models/`)
   ```javascript
   const createItem = async (userId, data) => {
     const result = await pool.query(
       'INSERT INTO items (user_id, name) VALUES ($1, $2) RETURNING *',
       [userId, data.name]
     );
     return result.rows[0];
   };
   ```

2. **Service 작성** (`src/services/`)
   ```javascript
   const createItemService = async (userId, data) => {
     // 비즈니스 로직
     if (!data.name) {
       throw { code: 'E-XXX', message: 'Name is required', status: 400 };
     }
     return await createItem(userId, data);
   };
   ```

3. **Controller 작성** (`src/controllers/`)
   ```javascript
   const createItemController = async (req, res) => {
     try {
       const result = await createItemService(req.user.id, req.body);
       res.status(201).json({ item: result });
     } catch (error) {
       res.status(error.status || 500).json({
         error: error.code || 'INTERNAL_ERROR',
         message: error.message
       });
     }
   };
   ```

4. **Route 등록** (`src/routes/`)
   ```javascript
   router.post('/items', authenticate, createItemController);
   ```

---

## 유용한 명령어

```bash
# 개발 서버 실행 (nodemon)
npm run dev

# 프로덕션 서버 실행
npm start

# 데이터베이스 스키마 재생성
psql -U postgres -d my_todolist -f src/db/schema.sql

# PostgreSQL 접속
psql -U postgres -d my_todolist
```

---

## 트러블슈팅

### 데이터베이스 연결 실패

**문제**: `Error: connect ECONNREFUSED`

**해결**:
1. PostgreSQL 서버 실행 확인
2. `.env` 파일의 DB 설정 확인
3. 포트 5432가 열려있는지 확인

### JWT 토큰 만료

**문제**: `E-101: Authentication required`

**해결**:
- 토큰 유효기간 확인 (24시간)
- 재로그인하여 새 토큰 발급

---

## API 테스트 도구

- **Swagger UI**: http://localhost:3000/api-docs
- **Postman**: 프로젝트 루트의 `swagger/swagger.json` import
- **curl**:
  ```bash
  # 로그인
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test123"}'

  # 할일 조회
  curl http://localhost:3000/api/todos \
    -H "Authorization: Bearer <token>"
  ```

---

## 참고 문서

- [pg 라이브러리 문서](https://node-postgres.com/)
- [Express 공식 문서](https://expressjs.com/)
- [JWT 공식 사이트](https://jwt.io/)
- [bcrypt 문서](https://www.npmjs.com/package/bcrypt)
