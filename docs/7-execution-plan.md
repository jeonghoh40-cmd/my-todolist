# 실행 계획 문서 - my-todolist

## 문서 정보
- **프로젝트명**: my-todolist
- **버전**: 1.0.0 (MVP)
- **작성일**: 2026-02-11
- **MVP 출시 목표**: 2026-02-14 (금요일 오후 3시)
- **총 개발 기간**: 3일

---

## 1. 개요

### 1.1 문서 목적
본 문서는 my-todolist 애플리케이션의 개발 작업을 체계적으로 관리하기 위한 실행 계획입니다. 데이터베이스, 백엔드, 프론트엔드 단위로 작업을 분해하고, 각 작업의 완료 조건과 의존성을 명확히 정의하여 3일이라는 짧은 개발 기간 동안 효율적인 개발을 지원합니다.

### 1.2 프로젝트 범위
- **In Scope (MVP 필수 기능)**:
  - 사용자 관리 (회원가입, 로그인, 로그아웃)
  - 할일 관리 (CRUD, 완료/미완료 토글)
  - 인증 기반 데이터 보안
  - 반응형 웹 UI
- **Out of Scope**:
  - 배포 환경 구성 (Vercel 제외)
  - 고급 검색/필터링 기능
  - 소셜 로그인
  - 알림/리마인더 기능

### 1.3 기술 스택
- **데이터베이스**: PostgreSQL 17
- **백엔드**: Node.js + Express + pg 라이브러리 (⚠️ Prisma 금지)
- **프론트엔드**: React 19 + TypeScript
- **인증**: JWT (24시간 유효기간) + bcrypt (cost factor 10+)

---

## 2. 데이터베이스 작업 계획 (DB Layer)

### 2.1 PostgreSQL 환경 설정

#### Task 2.1.1: PostgreSQL 17 설치 및 초기 설정
- **설명**: 로컬 개발 환경에 PostgreSQL 17 설치 및 기본 설정
- **의존성**: 없음
- **소요 시간**: 30분
- **완료 조건**:
  - [x] PostgreSQL 17 서버 실행 확인 (`psql --version` 출력 확인)
  - [x] postgres 사용자로 접속 가능 확인
  - [x] 로컬 연결 포트 5432 확인
  - [x] 데이터베이스 접속 테스트 완료

#### Task 2.1.2: my_todolist 데이터베이스 생성
- **설명**: 애플리케이션용 데이터베이스 생성
- **의존성**: Task 2.1.1
- **소요 시간**: 10분
- **완료 조건**:
  - [x] `CREATE DATABASE my_todolist;` 실행 성공
  - [x] UTF-8 인코딩 확인
  - [x] 데이터베이스 접속 확인 (`\c my_todolist`)
  - [x] 연결 정보 기록 (host, port, dbname, user, password)

### 2.2 스키마 설계 및 테이블 생성

#### Task 2.2.1: USERS 테이블 생성 및 검증
- **설명**: 사용자 정보를 저장하는 테이블 생성
- **의존성**: Task 2.1.2
- **소요 시간**: 20분
- **완료 조건**:
  - [x] 테이블 생성 SQL 작성 완료:
    ```sql
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```
  - [x] SQL 실행 성공
  - [x] `\d users` 명령으로 테이블 구조 확인
  - [x] UNIQUE 제약 조건 작동 테스트 (중복 username 삽입 시 에러 확인)
  - [x] INSERT 테스트 데이터 삽입 성공

#### Task 2.2.2: TODOS 테이블 생성 및 검증
- **설명**: 할일 정보를 저장하는 테이블 생성
- **의존성**: Task 2.2.1
- **소요 시간**: 30분
- **완료 조건**:
  - [x] 테이블 생성 SQL 작성 완료:
    ```sql
    CREATE TABLE todos (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      due_date DATE,
      is_completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```
  - [x] SQL 실행 성공
  - [x] `\d todos` 명령으로 테이블 구조 확인
  - [x] 외래 키 제약 조건 확인 (users 테이블 참조)
  - [x] ON DELETE CASCADE 동작 테스트 (사용자 삭제 시 할일도 삭제됨)
  - [x] INSERT 테스트 데이터 삽입 성공

#### Task 2.2.3: 인덱스 생성 및 성능 최적화
- **설명**: 쿼리 성능 향상을 위한 인덱스 생성
- **의존성**: Task 2.2.2
- **소요 시간**: 15분
- **완료 조건**:
  - [x] `CREATE INDEX idx_todos_user_id ON todos(user_id);` 실행 성공
  - [x] `CREATE INDEX idx_todos_is_completed ON todos(is_completed);` 실행 성공
  - [x] `\di` 명령으로 인덱스 목록 확인
  - [x] EXPLAIN ANALYZE로 쿼리 플랜 확인 (인덱스 사용 확인)

#### Task 2.2.4: 스키마 SQL 파일 생성
- **설명**: 재사용 가능한 스키마 생성 스크립트 작성
- **의존성**: Task 2.2.3
- **소요 시간**: 15분
- **완료 조건**:
  - [x] `backend/src/db/schema.sql` 파일 생성
  - [x] 모든 CREATE TABLE 문 포함
  - [x] 모든 CREATE INDEX 문 포함
  - [x] 초기화용 DROP TABLE IF EXISTS 문 포함
  - [x] 스크립트 실행 테스트 (`psql -d my_todolist -f schema.sql`)

---

## 3. 백엔드 작업 계획 (Backend Layer)

### 3.1 프로젝트 초기 설정

#### Task 3.1.1: Node.js + Express 프로젝트 초기화
- **설명**: 백엔드 프로젝트 구조 생성 및 초기 설정
- **의존성**: 없음
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `backend/` 디렉토리 생성
  - [ ] `npm init -y` 실행 완료
  - [ ] 필수 패키지 설치:
    - express
    - pg (PostgreSQL 클라이언트)
    - bcrypt
    - jsonwebtoken
    - dotenv
    - cors
  - [ ] 개발 패키지 설치:
    - nodemon
    - eslint
  - [ ] `package.json`에 scripts 추가:
    - `"start": "node src/server.js"`
    - `"dev": "nodemon src/server.js"`
  - [ ] 디렉토리 구조 생성:
    ```
    backend/
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   ├── models/
    │   ├── services/
    │   ├── utils/
    │   ├── db/
    │   ├── config/
    │   └── server.js
    ├── .env
    ├── .gitignore
    └── package.json
    ```

#### Task 3.1.2: 환경 변수 설정 (.env)
- **설명**: 환경 변수 파일 생성 및 설정
- **의존성**: Task 3.1.1
- **소요 시간**: 10분
- **완료 조건**:
  - [ ] `.env` 파일 생성
  - [ ] 데이터베이스 연결 정보 설정:
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=my_todolist
    DB_USER=postgres
    DB_PASSWORD=your_password
    ```
  - [ ] JWT 시크릿 키 설정:
    ```
    JWT_SECRET=your_super_secret_jwt_key_change_this
    JWT_EXPIRES_IN=24h
    ```
  - [ ] 서버 포트 설정:
    ```
    PORT=3001
    NODE_ENV=development
    ```
  - [ ] `.gitignore`에 `.env` 추가 확인

#### Task 3.1.3: PostgreSQL 연결 설정 (pg 라이브러리)
- **설명**: pg 라이브러리를 사용한 데이터베이스 연결 풀 설정
- **의존성**: Task 3.1.2, Task 2.1.2
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `src/db/connection.js` 파일 생성
  - [ ] pg.Pool 인스턴스 생성 및 export
  - [ ] 환경 변수 로드 (dotenv)
  - [ ] 연결 풀 설정 (max: 20, idleTimeoutMillis: 30000)
  - [ ] 데이터베이스 연결 테스트 함수 작성
  - [ ] `node src/db/connection.js` 실행 시 연결 성공 메시지 출력
  - [ ] ⚠️ Prisma 사용하지 않음 확인

#### Task 3.1.4: Express 서버 기본 설정
- **설명**: Express 앱 초기화 및 기본 미들웨어 설정
- **의존성**: Task 3.1.3
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] `src/server.js` 파일 생성
  - [ ] Express 앱 생성 및 미들웨어 설정:
    - express.json()
    - express.urlencoded()
    - cors()
  - [ ] 헬스 체크 엔드포인트 추가: `GET /api/health`
  - [ ] 서버 시작 코드 작성 (PORT 환경 변수 사용)
  - [ ] `npm run dev` 실행 시 서버 정상 시작 확인
  - [ ] `curl http://localhost:3001/api/health` 응답 확인

### 3.2 인증 관련 기능 개발

#### Task 3.2.1: 비밀번호 암호화 유틸리티 개발
- **설명**: bcrypt를 사용한 비밀번호 암호화/검증 함수
- **의존성**: Task 3.1.1
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] `src/utils/password.utils.js` 파일 생성
  - [ ] `hashPassword(password)` 함수 구현:
    - bcrypt.hash() 사용
    - cost factor 10 이상
    - 반환: 해시된 비밀번호 문자열
  - [ ] `comparePassword(password, hash)` 함수 구현:
    - bcrypt.compare() 사용
    - 반환: boolean (일치 여부)
  - [ ] 함수 테스트:
    - 동일 비밀번호 해시 시 다른 해시 생성 확인
    - comparePassword() 정상 동작 확인

#### Task 3.2.2: JWT 유틸리티 개발
- **설명**: JWT 토큰 생성 및 검증 함수
- **의존성**: Task 3.1.2
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] `src/utils/jwt.utils.js` 파일 생성
  - [ ] `generateToken(payload)` 함수 구현:
    - jwt.sign() 사용
    - payload: { userId, username }
    - 유효기간: 24시간 (환경 변수)
    - 반환: JWT 토큰 문자열
  - [ ] `verifyToken(token)` 함수 구현:
    - jwt.verify() 사용
    - 반환: decoded payload 또는 null
  - [ ] 함수 테스트:
    - 토큰 생성 및 검증 성공 확인
    - 잘못된 토큰 검증 시 null 반환 확인

#### Task 3.2.3: 인증 미들웨어 개발
- **설명**: API 요청 인증 확인 미들웨어
- **의존성**: Task 3.2.2
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `src/middleware/auth.middleware.js` 파일 생성
  - [ ] `authenticate` 미들웨어 함수 구현:
    - Authorization 헤더에서 토큰 추출 (Bearer 형식)
    - verifyToken() 호출하여 토큰 검증
    - 성공 시 req.user에 사용자 정보 추가
    - 실패 시 HTTP 401 응답 + E-101 에러
  - [ ] 에러 응답 형식:
    ```json
    {
      "error": "E-101",
      "message": "Authentication required"
    }
    ```
  - [ ] 미들웨어 테스트:
    - 유효한 토큰 전달 시 next() 호출 확인
    - 토큰 없음/잘못된 토큰 시 401 응답 확인

### 3.3 사용자 관리 API 개발

#### Task 3.3.1: 사용자 모델 개발 (users 테이블 쿼리)
- **설명**: users 테이블과 상호작용하는 SQL 쿼리 함수
- **의존성**: Task 3.1.3, Task 2.2.1
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `src/models/user.model.js` 파일 생성
  - [ ] `createUser(username, password, email)` 함수 구현:
    - SQL: `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email, created_at`
    - 파라미터화된 쿼리 사용 (SQL Injection 방어)
    - 반환: 생성된 사용자 객체
  - [ ] `findUserByUsername(username)` 함수 구현:
    - SQL: `SELECT * FROM users WHERE username = $1`
    - 반환: 사용자 객체 또는 null
  - [ ] `findUserById(userId)` 함수 구현:
    - SQL: `SELECT id, username, email, created_at FROM users WHERE id = $1`
    - 반환: 사용자 객체 또는 null
  - [ ] 함수 테스트:
    - 사용자 생성 성공 확인
    - username 중복 시 에러 확인
    - 사용자 조회 성공 확인

#### Task 3.3.2: 인증 서비스 개발 (비즈니스 로직)
- **설명**: 회원가입 및 로그인 비즈니스 로직
- **의존성**: Task 3.3.1, Task 3.2.1, Task 3.2.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/services/auth.service.js` 파일 생성
  - [ ] `register(username, password, email)` 함수 구현:
    - username 중복 확인 (findUserByUsername)
    - 비밀번호 해시 (hashPassword)
    - 사용자 생성 (createUser)
    - 중복 시 에러 throw: { code: 'E-001', message: 'Username already exists', status: 409 }
  - [ ] `login(username, password)` 함수 구현:
    - 사용자 조회 (findUserByUsername)
    - 비밀번호 검증 (comparePassword)
    - JWT 토큰 생성 (generateToken)
    - 실패 시 에러 throw: { code: 'E-002', message: 'Invalid credentials', status: 401 }
  - [ ] 이메일 형식 검증 함수 추가 (정규식)
  - [ ] 함수 테스트:
    - 회원가입 성공 시나리오
    - username 중복 에러 시나리오
    - 로그인 성공 시나리오
    - 잘못된 자격증명 에러 시나리오

#### Task 3.3.3: 인증 컨트롤러 개발
- **설명**: 회원가입 및 로그인 API 핸들러
- **의존성**: Task 3.3.2
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `src/controllers/auth.controller.js` 파일 생성
  - [ ] `registerController(req, res)` 함수 구현:
    - req.body에서 username, password, email 추출
    - 입력 검증 (필수 필드 확인)
    - auth.service.register() 호출
    - 성공 시 HTTP 201 + 사용자 정보 반환
    - 에러 시 적절한 HTTP 상태 코드 + 에러 메시지
  - [ ] `loginController(req, res)` 함수 구현:
    - req.body에서 username, password 추출
    - auth.service.login() 호출
    - 성공 시 HTTP 200 + JWT 토큰 반환
    - 에러 시 적절한 HTTP 상태 코드 + 에러 메시지
  - [ ] 에러 핸들링 try-catch 추가
  - [ ] 응답 형식 일관성 확인

#### Task 3.3.4: 인증 라우터 설정
- **설명**: 인증 관련 API 라우팅
- **의존성**: Task 3.3.3
- **소요 시간**: 15분
- **완료 조건**:
  - [ ] `src/routes/auth.routes.js` 파일 생성
  - [ ] Express Router 생성
  - [ ] `POST /api/auth/register` 라우트 등록
  - [ ] `POST /api/auth/login` 라우트 등록
  - [ ] `src/server.js`에 라우터 등록: `app.use('/api/auth', authRoutes)`
  - [ ] Postman/Thunder Client 테스트:
    - 회원가입 성공 (HTTP 201)
    - username 중복 에러 (HTTP 409)
    - 로그인 성공 (HTTP 200 + 토큰)
    - 잘못된 자격증명 에러 (HTTP 401)

### 3.4 할일 관리 API 개발

#### Task 3.4.1: 할일 모델 개발 (todos 테이블 쿼리)
- **설명**: todos 테이블과 상호작용하는 SQL 쿼리 함수
- **의존성**: Task 3.1.3, Task 2.2.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/models/todo.model.js` 파일 생성
  - [ ] `createTodo(userId, title, description, dueDate)` 함수 구현:
    - SQL: `INSERT INTO todos (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *`
    - 반환: 생성된 할일 객체
  - [ ] `findTodosByUserId(userId)` 함수 구현:
    - SQL: `SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC`
    - 반환: 할일 배열
  - [ ] `findTodoById(todoId)` 함수 구현:
    - SQL: `SELECT * FROM todos WHERE id = $1`
    - 반환: 할일 객체 또는 null
  - [ ] `updateTodo(todoId, title, description, dueDate)` 함수 구현:
    - SQL: `UPDATE todos SET title = $1, description = $2, due_date = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`
    - 반환: 수정된 할일 객체
  - [ ] `deleteTodo(todoId)` 함수 구현:
    - SQL: `DELETE FROM todos WHERE id = $1`
    - 반환: 삭제 성공 여부
  - [ ] `toggleTodoComplete(todoId, isCompleted)` 함수 구현:
    - SQL: `UPDATE todos SET is_completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
    - 반환: 수정된 할일 객체
  - [ ] 함수 테스트:
    - 할일 생성/조회/수정/삭제 성공 확인

#### Task 3.4.2: 할일 서비스 개발 (비즈니스 로직)
- **설명**: 할일 관련 비즈니스 로직 및 권한 검증
- **의존성**: Task 3.4.1
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/services/todos.service.js` 파일 생성
  - [ ] `createTodoService(userId, data)` 함수 구현:
    - title 필수 검증
    - createTodo() 호출
    - title 없으면 에러 throw: { code: 'E-103', message: 'Title is required', status: 400 }
  - [ ] `getTodosService(userId)` 함수 구현:
    - findTodosByUserId() 호출
  - [ ] `updateTodoService(userId, todoId, data)` 함수 구현:
    - 할일 조회 (findTodoById)
    - 소유권 검증 (todo.user_id === userId)
    - title 필수 검증
    - updateTodo() 호출
    - 존재하지 않으면 에러: E-104
    - 권한 없으면 에러: E-102
  - [ ] `deleteTodoService(userId, todoId)` 함수 구현:
    - 소유권 검증
    - deleteTodo() 호출
  - [ ] `toggleCompleteService(userId, todoId)` 함수 구현:
    - 할일 조회
    - 소유권 검증
    - isCompleted 토글
    - toggleTodoComplete() 호출
  - [ ] 함수 테스트:
    - 권한 검증 로직 테스트
    - 에러 케이스 테스트

#### Task 3.4.3: 할일 컨트롤러 개발
- **설명**: 할일 CRUD API 핸들러
- **의존성**: Task 3.4.2, Task 3.2.3
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/controllers/todos.controller.js` 파일 생성
  - [ ] `getTodosController(req, res)` 함수 구현:
    - req.user.id로 userId 추출 (인증 미들웨어에서 설정)
    - getTodosService() 호출
    - HTTP 200 + 할일 배열 반환
  - [ ] `createTodoController(req, res)` 함수 구현:
    - req.body에서 title, description, dueDate 추출
    - createTodoService() 호출
    - HTTP 201 + 생성된 할일 반환
  - [ ] `updateTodoController(req, res)` 함수 구현:
    - req.params.id로 todoId 추출
    - updateTodoService() 호출
    - HTTP 200 + 수정된 할일 반환
  - [ ] `deleteTodoController(req, res)` 함수 구현:
    - deleteTodoService() 호출
    - HTTP 204 No Content 반환
  - [ ] `toggleCompleteController(req, res)` 함수 구현:
    - toggleCompleteService() 호출
    - HTTP 200 + 수정된 할일 반환
  - [ ] 에러 핸들링 추가

#### Task 3.4.4: 할일 라우터 설정
- **설명**: 할일 관련 API 라우팅 (인증 미들웨어 적용)
- **의존성**: Task 3.4.3
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] `src/routes/todos.routes.js` 파일 생성
  - [ ] Express Router 생성
  - [ ] 모든 라우트에 authenticate 미들웨어 적용
  - [ ] `GET /api/todos` 라우트 등록
  - [ ] `POST /api/todos` 라우트 등록
  - [ ] `PUT /api/todos/:id` 라우트 등록
  - [ ] `DELETE /api/todos/:id` 라우트 등록
  - [ ] `PATCH /api/todos/:id/complete` 라우트 등록
  - [ ] `src/server.js`에 라우터 등록
  - [ ] Postman/Thunder Client 테스트:
    - 미인증 요청 시 HTTP 401
    - 할일 CRUD 모든 기능 정상 동작
    - 타인의 할일 접근 시 HTTP 403

### 3.5 API 통합 테스트

#### Task 3.5.1: API 문서화
- **설명**: Postman Collection 또는 Markdown 문서 작성
- **의존성**: Task 3.3.4, Task 3.4.4
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] API 엔드포인트 목록 문서화
  - [ ] 요청/응답 형식 예시 작성
  - [ ] 에러 코드 정리 (E-001 ~ E-104)
  - [ ] Postman Collection 파일 생성 (선택)

#### Task 3.5.2: 통합 테스트 시나리오 실행
- **설명**: 전체 API 통합 테스트
- **의존성**: Task 3.5.1
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] 시나리오 1: 회원가입 → 로그인 → 할일 추가 → 조회
  - [ ] 시나리오 2: 할일 수정 → 완료 처리 → 삭제
  - [ ] 시나리오 3: 미인증 접근 테스트
  - [ ] 시나리오 4: 타인의 할일 접근 테스트
  - [ ] 시나리오 5: 모든 에러 코드 발생 테스트
  - [ ] 모든 시나리오 통과 확인

---

## 4. 프론트엔드 작업 계획 (Frontend Layer)

### 4.1 프로젝트 초기 설정

#### Task 4.1.1: React 19 + TypeScript 프로젝트 초기화
- **설명**: Vite를 사용한 React 프로젝트 생성
- **의존성**: 없음
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `npm create vite@latest frontend -- --template react-ts` 실행
  - [ ] `frontend/` 디렉토리로 이동 후 `npm install`
  - [ ] 추가 패키지 설치:
    - react-router-dom
    - axios (또는 fetch 사용)
  - [ ] 디렉토리 구조 생성:
    ```
    frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   ├── contexts/
    │   ├── api/
    │   ├── types/
    │   ├── styles/
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── package.json
    └── tsconfig.json
    ```
  - [ ] `npm run dev` 실행 시 개발 서버 정상 시작 (http://localhost:5173)

#### Task 4.1.2: TypeScript 타입 정의
- **설명**: API 응답 및 도메인 타입 정의
- **의존성**: Task 4.1.1
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] `src/types/auth.ts` 파일 생성:
    - User 인터페이스 (id, username, email, createdAt)
    - LoginRequest, LoginResponse 인터페이스
    - RegisterRequest, RegisterResponse 인터페이스
  - [ ] `src/types/todo.ts` 파일 생성:
    - Todo 인터페이스 (id, userId, title, description, dueDate, isCompleted, createdAt, updatedAt)
    - CreateTodoRequest, UpdateTodoRequest 인터페이스
  - [ ] `src/types/api.ts` 파일 생성:
    - ApiError 인터페이스 (error, message)
  - [ ] 모든 필드 타입 명시 (string, number, boolean, Date)

#### Task 4.1.3: 라우팅 설정 (React Router)
- **설명**: 페이지 라우팅 및 인증 가드 설정
- **의존성**: Task 4.1.1
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `react-router-dom` 라우터 설정
  - [ ] `App.tsx`에 BrowserRouter 및 Routes 설정
  - [ ] 라우트 정의:
    - `/register` - 회원가입 페이지
    - `/login` - 로그인 페이지
    - `/todos` - 할일 목록 페이지 (인증 필요)
    - `/` - 기본 경로 (로그인 여부에 따라 리다이렉트)
  - [ ] PrivateRoute 컴포넌트 구현 (인증 가드)
  - [ ] 미인증 사용자 접근 시 `/login`으로 리다이렉트
  - [ ] 라우팅 테스트: 각 경로 접근 확인

### 4.2 전역 상태 및 API 설정

#### Task 4.2.1: 인증 컨텍스트 개발
- **설명**: 사용자 인증 상태 관리 Context
- **의존성**: Task 4.1.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/contexts/AuthContext.tsx` 파일 생성
  - [ ] AuthContext 생성 (React.createContext)
  - [ ] AuthProvider 컴포넌트 구현:
    - useState로 user, token 상태 관리
    - localStorage에서 토큰 로드 (초기화 시)
    - login(token, user) 함수: 토큰 및 사용자 정보 저장
    - logout() 함수: 토큰 및 사용자 정보 삭제
    - isAuthenticated 계산 속성
  - [ ] useAuth 커스텀 훅 구현
  - [ ] `App.tsx`에 AuthProvider 적용
  - [ ] 테스트: 로그인/로그아웃 시 상태 변경 확인

#### Task 4.2.2: API 유틸리티 개발
- **설명**: 백엔드 API와 통신하는 함수
- **의존성**: Task 4.2.1, Task 4.1.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/api/api.ts` 파일 생성
  - [ ] API 베이스 URL 설정: `http://localhost:3001/api`
  - [ ] 인증 API 함수:
    - `register(username, password, email)`: POST /auth/register
    - `login(username, password)`: POST /auth/login
  - [ ] 할일 API 함수:
    - `getTodos(token)`: GET /todos
    - `createTodo(token, data)`: POST /todos
    - `updateTodo(token, todoId, data)`: PUT /todos/:id
    - `deleteTodo(token, todoId)`: DELETE /todos/:id
    - `toggleComplete(token, todoId, isCompleted)`: PATCH /todos/:id/complete
  - [ ] Authorization 헤더 자동 추가 (Bearer token)
  - [ ] 에러 처리 로직 추가
  - [ ] 함수 테스트: API 호출 성공 확인

### 4.3 인증 UI 개발

#### Task 4.3.1: 회원가입 페이지 개발
- **설명**: 사용자 회원가입 UI
- **의존성**: Task 4.2.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/pages/Register.tsx` 파일 생성
  - [ ] 입력 필드 구현:
    - username (required)
    - password (required, type="password")
    - email (required, type="email")
  - [ ] "회원가입" 버튼 구현
  - [ ] "이미 계정이 있으신가요? 로그인" 링크 (`/login`)
  - [ ] 폼 제출 시:
    - 입력 검증 (빈 값, 이메일 형식)
    - register() API 호출
    - 성공 시 `/login`으로 리다이렉트
    - 에러 시 에러 메시지 표시 (E-001, E-003)
  - [ ] 로딩 상태 표시 (버튼 disabled)
  - [ ] 반응형 디자인 (모바일/데스크톱)

#### Task 4.3.2: 로그인 페이지 개발
- **설명**: 사용자 로그인 UI
- **의존성**: Task 4.2.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/pages/Login.tsx` 파일 생성
  - [ ] 입력 필드 구현:
    - username (required)
    - password (required, type="password")
  - [ ] "로그인" 버튼 구현
  - [ ] "계정이 없으신가요? 회원가입" 링크 (`/register`)
  - [ ] 폼 제출 시:
    - 입력 검증
    - login() API 호출
    - 성공 시 AuthContext.login() 호출 + `/todos`로 리다이렉트
    - 에러 시 에러 메시지 표시 (E-002)
  - [ ] 로딩 상태 표시
  - [ ] 반응형 디자인

### 4.4 할일 관리 UI 개발

#### Task 4.4.1: 할일 목록 페이지 개발
- **설명**: 할일 목록 메인 페이지
- **의존성**: Task 4.2.2, Task 4.2.1
- **소요 시간**: 60분
- **완료 조건**:
  - [ ] `src/pages/TodoList.tsx` 파일 생성
  - [ ] 상단 헤더:
    - "나의 할일 목록" 제목
    - 사용자 이름 표시 (AuthContext에서 가져오기)
    - "로그아웃" 버튼
  - [ ] "+ 할일 추가" 버튼
  - [ ] 할일 목록 영역:
    - getTodos() API 호출 (useEffect)
    - 할일 배열 렌더링 (TodoItem 컴포넌트 사용)
    - 빈 상태 메시지: "할일이 없습니다. 새로운 할일을 추가해보세요!"
  - [ ] 로딩 상태 표시
  - [ ] 에러 처리 (인증 실패 시 로그인으로 리다이렉트)
  - [ ] 반응형 디자인 (세로 스택)

#### Task 4.4.2: 할일 아이템 컴포넌트 개발
- **설명**: 개별 할일 표시 컴포넌트
- **의존성**: Task 4.1.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/components/TodoItem.tsx` 파일 생성
  - [ ] Props: todo, onUpdate, onDelete, onToggleComplete
  - [ ] UI 요소:
    - 완료 체크박스 (isCompleted)
    - 제목 (완료 시 취소선)
    - 설명 (옵션)
    - 마감일 (옵션, 포맷팅)
    - "수정" 버튼
    - "삭제" 버튼
  - [ ] 완료 시 시각적 피드백 (회색 배경, 취소선)
  - [ ] 체크박스 클릭 시 onToggleComplete 호출
  - [ ] "수정" 클릭 시 수정 모드 전환
  - [ ] "삭제" 클릭 시 확인 다이얼로그 표시
  - [ ] 반응형 디자인 (카드 형태)

#### Task 4.4.3: 할일 폼 컴포넌트 개발
- **설명**: 할일 추가/수정 폼 (모달 또는 인라인)
- **의존성**: Task 4.1.2
- **소요 시간**: 40분
- **완료 조건**:
  - [ ] `src/components/TodoForm.tsx` 파일 생성
  - [ ] Props: initialData (수정 시), onSubmit, onCancel
  - [ ] 입력 필드:
    - 제목 (required, maxLength: 255)
    - 설명 (textarea, optional)
    - 마감일 (DatePicker, optional)
  - [ ] "저장" 버튼
  - [ ] "취소" 버튼
  - [ ] 폼 검증:
    - 제목 필수 확인 → E-103 에러 표시
  - [ ] 제출 시 onSubmit 콜백 호출
  - [ ] 반응형 디자인 (모달 형태)

#### Task 4.4.4: 삭제 확인 다이얼로그 개발
- **설명**: 할일 삭제 확인 UI
- **의존성**: Task 4.1.1
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] `src/components/ConfirmModal.tsx` 파일 생성
  - [ ] Props: isOpen, message, onConfirm, onCancel
  - [ ] UI:
    - 메시지 표시 (예: "정말 삭제하시겠습니까?")
    - 할일 제목 표시
    - "삭제" 버튼 (빨간색)
    - "취소" 버튼
  - [ ] "삭제" 클릭 시 onConfirm 호출
  - [ ] "취소" 클릭 시 onCancel 호출
  - [ ] 모달 오버레이 (배경 어둡게)

#### Task 4.4.5: 할일 관리 기능 통합
- **설명**: TodoList 페이지에 CRUD 기능 통합
- **의존성**: Task 4.4.1, Task 4.4.2, Task 4.4.3, Task 4.4.4, Task 4.2.2
- **소요 시간**: 60분
- **완료 조건**:
  - [ ] "+ 할일 추가" 클릭 시 TodoForm 모달 표시
  - [ ] 할일 추가 기능:
    - createTodo() API 호출
    - 성공 시 목록에 추가
    - 에러 시 에러 메시지 표시
  - [ ] 할일 수정 기능:
    - "수정" 클릭 시 TodoForm 모달 표시 (기존 데이터)
    - updateTodo() API 호출
    - 성공 시 목록 업데이트
  - [ ] 할일 삭제 기능:
    - "삭제" 클릭 시 ConfirmModal 표시
    - 확인 시 deleteTodo() API 호출
    - 성공 시 목록에서 제거
  - [ ] 할일 완료 기능:
    - 체크박스 클릭 시 toggleComplete() API 호출
    - 성공 시 isCompleted 상태 토글
    - 시각적 피드백 즉시 반영
  - [ ] 모든 기능 정상 동작 확인

### 4.5 스타일링 및 UX 개선

#### Task 4.5.1: 전역 스타일 설정
- **설명**: CSS 전역 스타일 및 테마 설정
- **의존성**: Task 4.1.1
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] `src/styles/globals.css` 파일 생성
  - [ ] CSS Reset 적용
  - [ ] 폰트 설정 (시스템 폰트 또는 Noto Sans KR)
  - [ ] 색상 변수 정의:
    - Primary, Secondary, Success, Danger, Gray 계열
  - [ ] 반응형 브레이크포인트 정의:
    - Mobile: < 768px
    - Tablet: 768px ~ 1024px
    - Desktop: > 1024px
  - [ ] `main.tsx`에 import

#### Task 4.5.2: 반응형 디자인 적용
- **설명**: 모바일/데스크톱 모두 지원하는 반응형 UI
- **의존성**: Task 4.5.1, Task 4.4.5
- **소요 시간**: 60분
- **완료 조건**:
  - [ ] 모바일 뷰 (375px ~ 768px):
    - 세로 스택 레이아웃
    - 할일 카드 1열
    - 터치 친화적 버튼 크기 (44x44px 이상)
    - 모달 전체 화면 또는 하단 시트
  - [ ] 데스크톱 뷰 (1024px 이상):
    - 그리드 레이아웃 (2-3열)
    - 중앙 정렬 카드
    - 모달 중앙 배치 (오버레이)
  - [ ] 브라우저 DevTools로 각 화면 크기 테스트
  - [ ] 가로 모드 테스트

#### Task 4.5.3: UX 개선 요소 추가
- **설명**: 사용자 경험 향상 요소
- **의존성**: Task 4.5.2
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] 로딩 스피너 컴포넌트 추가
  - [ ] API 호출 중 버튼 disabled 처리
  - [ ] 성공/에러 메시지 Toast 알림 추가
  - [ ] 완료 처리 시 애니메이션 효과 (체크 표시)
  - [ ] 할일 추가/삭제 시 페이드 인/아웃 애니메이션
  - [ ] 입력 필드 포커스 시 테두리 색상 변경
  - [ ] 버튼 호버 효과 (데스크톱)

---

## 5. 통합 및 테스트 작업 계획 (Integration & Testing)

### 5.1 프론트엔드-백엔드 통합

#### Task 5.1.1: CORS 설정 및 연결 테스트
- **설명**: 프론트엔드-백엔드 통신 설정
- **의존성**: Task 3.1.4, Task 4.1.1
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] 백엔드 `server.js`에 CORS 미들웨어 설정:
    ```javascript
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }));
    ```
  - [ ] 프론트엔드 API 호출 테스트
  - [ ] Authorization 헤더 전달 확인
  - [ ] OPTIONS preflight 요청 정상 처리 확인

#### Task 5.1.2: 환경 변수 설정 (프론트엔드)
- **설명**: 프론트엔드 환경 변수 설정
- **의존성**: Task 5.1.1
- **소요 시간**: 10분
- **완료 조건**:
  - [ ] `frontend/.env` 파일 생성
  - [ ] API 베이스 URL 설정:
    ```
    VITE_API_BASE_URL=http://localhost:3001/api
    ```
  - [ ] `api.ts`에서 환경 변수 사용
  - [ ] `.gitignore`에 `.env` 추가

### 5.2 End-to-End 테스트

#### Task 5.2.1: 사용자 시나리오 1 - 신규 사용자 전체 플로우
- **설명**: 회원가입부터 할일 완료까지
- **의존성**: Task 5.1.2
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] 회원가입 (username: test_user_001)
  - [ ] 로그인 성공
  - [ ] 할일 3개 추가 (제목만, 제목+설명, 제목+설명+마감일)
  - [ ] 첫 번째 할일 완료 처리 (체크박스)
  - [ ] 두 번째 할일 수정
  - [ ] 세 번째 할일 삭제 (확인 다이얼로그)
  - [ ] 로그아웃
  - [ ] 재로그인 후 데이터 유지 확인

#### Task 5.2.2: 사용자 시나리오 2 - 에러 처리
- **설명**: 모든 에러 케이스 테스트
- **의존성**: Task 5.2.1
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] E-001: 중복 username으로 회원가입 → 에러 메시지 확인
  - [ ] E-002: 잘못된 자격증명으로 로그인 → 에러 메시지 확인
  - [ ] E-003: 잘못된 이메일 형식 → 에러 메시지 확인
  - [ ] E-101: 미인증 상태에서 할일 추가 → 로그인 리다이렉트
  - [ ] E-102: 타인의 할일 접근 (브라우저 DevTools로 직접 API 호출) → 403 에러
  - [ ] E-103: 제목 없이 할일 추가 → 에러 메시지 확인
  - [ ] E-104: 존재하지 않는 할일 수정 → 에러 메시지 확인

#### Task 5.2.3: 반응형 디자인 테스트
- **설명**: 다양한 화면 크기 테스트
- **의존성**: Task 5.2.2
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] Chrome DevTools → 모바일 뷰 (375x667)
    - 회원가입, 로그인 화면 정상 표시
    - 할일 목록 세로 스택
    - 모달 전체 화면
  - [ ] 태블릿 뷰 (768x1024)
    - 할일 목록 1-2열
  - [ ] 데스크톱 뷰 (1920x1080)
    - 할일 목록 그리드 (2-3열)
    - 중앙 정렬
  - [ ] 모든 화면 크기에서 기능 정상 동작

#### Task 5.2.4: 성능 테스트
- **설명**: API 응답 시간 및 로딩 성능 확인
- **의존성**: Task 5.2.3
- **소요 시간**: 20분
- **완료 조건**:
  - [ ] Chrome DevTools Network 탭 확인
  - [ ] 로그인 API 응답 시간 < 500ms
  - [ ] 할일 목록 조회 응답 시간 < 1초
  - [ ] 할일 추가 응답 시간 < 500ms
  - [ ] 할일 완료 처리 응답 시간 < 300ms
  - [ ] 페이지 초기 로딩 시간 < 3초

### 5.3 버그 수정 및 최종 점검

#### Task 5.3.1: 버그 목록 작성 및 수정
- **설명**: 테스트 중 발견된 버그 수정
- **의존성**: Task 5.2.4
- **소요 시간**: 60분 (버그 수에 따라 가변)
- **완료 조건**:
  - [ ] 버그 목록 작성 (우선순위별)
  - [ ] 치명적 버그 (P0) 100% 수정
  - [ ] 주요 버그 (P1) 수정 (시간 허용 시)
  - [ ] 수정 후 재테스트 완료

#### Task 5.3.2: 코드 정리 및 주석 추가
- **설명**: 코드 품질 개선
- **의존성**: Task 5.3.1
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] TypeScript 에러 0건 확인 (`tsc --noEmit`)
  - [ ] ESLint 경고 주요 항목 수정
  - [ ] 복잡한 로직에 주석 추가 (한글 허용)
  - [ ] console.log 제거 (개발용 제외)
  - [ ] 미사용 import 제거

#### Task 5.3.3: README 문서 작성
- **설명**: 설치 및 실행 가이드 작성
- **의존성**: Task 5.3.2
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] 루트 `README.md` 작성:
    - 프로젝트 소개
    - 기술 스택
    - 설치 방법 (PostgreSQL, Node.js)
    - 환경 변수 설정 (.env 예시)
    - 실행 방법 (백엔드, 프론트엔드)
    - 주요 기능 목록
  - [ ] 백엔드 `README.md` 작성:
    - API 엔드포인트 목록
    - 요청/응답 예시
  - [ ] 프론트엔드 `README.md` 작성:
    - 컴포넌트 구조
    - 실행 방법

#### Task 5.3.4: MVP 출시 최종 점검
- **설명**: 최종 체크리스트 확인
- **의존성**: Task 5.3.3
- **소요 시간**: 30분
- **완료 조건**:
  - [ ] **P0 기능 100% 동작 확인**:
    - [ ] 회원가입 (F-001)
    - [ ] 로그인 (F-002)
    - [ ] 로그아웃 (F-003)
    - [ ] 할일 추가 (F-101)
    - [ ] 할일 목록 조회 (F-102)
    - [ ] 할일 수정 (F-103)
    - [ ] 할일 삭제 (F-104)
    - [ ] 할일 완료/미완료 토글 (F-105)
  - [ ] **에러 코드 정상 작동**:
    - [ ] E-001 (Username already exists)
    - [ ] E-002 (Invalid credentials)
    - [ ] E-003 (Invalid email format)
    - [ ] E-101 (Authentication required)
    - [ ] E-102 (Access denied)
    - [ ] E-103 (Title is required)
    - [ ] E-104 (Todo not found)
  - [ ] **반응형 디자인**:
    - [ ] 모바일 (375px) 정상 표시
    - [ ] 태블릿 (768px) 정상 표시
    - [ ] 데스크톱 (1920px) 정상 표시
  - [ ] **성능 기준 충족**:
    - [ ] API 응답 시간 < 1초
    - [ ] 페이지 로딩 시간 < 3초
  - [ ] **기술 요구사항 충족**:
    - [ ] pg 라이브러리 사용 (Prisma 미사용)
    - [ ] bcrypt 비밀번호 암호화
    - [ ] JWT 인증 (24시간 유효기간)
    - [ ] PostgreSQL 17 연동
  - [ ] **보안 요구사항 충족**:
    - [ ] SQL Injection 방어
    - [ ] XSS 방어
    - [ ] 인증/인가 검증
  - [ ] **치명적 버그 0건**
  - [ ] **오후 3시까지 출시 준비 완료**

---

## 6. 일정 계획 (3일)

### 6.1 Day 1 (2026-02-12, 수요일) - 백엔드 개발

#### 오전 (09:00 - 12:00)
- **09:00 - 09:30**: Task 2.1.1 ~ Task 2.1.2 (PostgreSQL 설정)
- **09:30 - 10:30**: Task 2.2.1 ~ Task 2.2.4 (스키마 생성)
- **10:30 - 11:00**: Task 3.1.1 ~ Task 3.1.2 (Express 프로젝트 초기화)
- **11:00 - 11:30**: Task 3.1.3 (PostgreSQL 연결)
- **11:30 - 12:00**: Task 3.1.4 (Express 서버 설정)

#### 오후 (13:00 - 18:00)
- **13:00 - 14:00**: Task 3.2.1 ~ Task 3.2.3 (인증 관련 기능)
- **14:00 - 16:00**: Task 3.3.1 ~ Task 3.3.4 (사용자 관리 API)
- **16:00 - 18:00**: Task 3.4.1 ~ Task 3.4.4 (할일 관리 API)

#### Day 1 완료 기준
- [ ] PostgreSQL 데이터베이스 및 테이블 생성 완료
- [ ] 모든 백엔드 API 엔드포인트 구현 완료
- [ ] Postman/Thunder Client로 API 테스트 통과
- [ ] pg 라이브러리를 사용한 SQL 쿼리 정상 동작

---

### 6.2 Day 2 (2026-02-13, 목요일) - 프론트엔드 개발

#### 오전 (09:00 - 12:00)
- **09:00 - 09:30**: Task 4.1.1 (React 프로젝트 초기화)
- **09:30 - 10:00**: Task 4.1.2 ~ Task 4.1.3 (타입 정의, 라우팅)
- **10:00 - 11:00**: Task 4.2.1 ~ Task 4.2.2 (AuthContext, API 유틸리티)
- **11:00 - 12:00**: Task 4.3.1 ~ Task 4.3.2 (회원가입, 로그인 페이지)

#### 오후 (13:00 - 18:00)
- **13:00 - 15:00**: Task 4.4.1 ~ Task 4.4.4 (할일 관리 UI)
- **15:00 - 17:00**: Task 4.4.5 (할일 기능 통합)
- **17:00 - 18:00**: Task 4.5.1 ~ Task 4.5.3 (스타일링, UX 개선)

#### Day 2 완료 기준
- [ ] 모든 페이지 UI 구현 완료
- [ ] 백엔드 API 연동 완료
- [ ] 인증 플로우 정상 동작 (로그인 → 할일 목록)
- [ ] 반응형 디자인 적용 (모바일/데스크톱)

---

### 6.3 Day 3 (2026-02-14, 금요일) - 통합 및 마무리

#### 오전 (09:00 - 12:00)
- **09:00 - 09:30**: Task 5.1.1 ~ Task 5.1.2 (CORS, 환경 변수)
- **09:30 - 10:30**: Task 5.2.1 (E2E 테스트 시나리오 1)
- **10:30 - 11:30**: Task 5.2.2 ~ Task 5.2.3 (에러 처리, 반응형 테스트)
- **11:30 - 12:00**: Task 5.2.4 (성능 테스트)

#### 오후 (13:00 - 15:00)
- **13:00 - 14:00**: Task 5.3.1 (버그 수정)
- **14:00 - 14:30**: Task 5.3.2 ~ Task 5.3.3 (코드 정리, README)
- **14:30 - 15:00**: Task 5.3.4 (최종 점검)

#### **15:00**: 🚀 **MVP 출시 완료**

#### Day 3 완료 기준
- [ ] 모든 P0 기능 정상 동작
- [ ] 주요 버그 수정 완료
- [ ] README 문서 작성 완료
- [ ] **오후 3시까지 출시 준비 완료**

---

## 7. 리스크 관리

### 7.1 일정 리스크

#### 리스크 1: 3일 개발 기간 부족
- **확률**: 높음
- **영향**: 높음
- **완화 전략**:
  - [ ] MVP 범위 엄격 준수 (Out-of-Scope 기능 제외)
  - [ ] 복잡한 디자인 지양 (간단한 UI)
  - [ ] Day 2 오후부터 통합 테스트 시작 (병렬 작업)
  - [ ] 일정 지연 시 우선순위 조정 (P1 기능 연기)

#### 리스크 2: 통합 버그 발견
- **확률**: 중간
- **영향**: 높음
- **완화 전략**:
  - [ ] Day 3 오전에 충분한 테스트 시간 확보
  - [ ] 간단한 에러 처리 패턴 사용
  - [ ] API 문서 사전 공유 (프론트엔드-백엔드)

### 7.2 기술 리스크

#### 리스크 3: pg 라이브러리 미숙
- **확률**: 중간
- **영향**: 중간
- **완화 전략**:
  - [ ] 간단한 SQL 쿼리만 사용 (복잡한 JOIN 지양)
  - [ ] 파라미터화된 쿼리로 SQL Injection 방어
  - [ ] Day 1 초기에 연결 테스트 완료

#### 리스크 4: JWT 토큰 관리 복잡도
- **확률**: 낮음
- **영향**: 낮음
- **완화 전략**:
  - [ ] 리프레시 토큰 제외 (액세스 토큰만)
  - [ ] 24시간 긴 유효기간 설정
  - [ ] localStorage 저장 (간단한 방식)

#### 리스크 5: React 19 호환성 문제
- **확률**: 낮음
- **영향**: 중간
- **완화 전략**:
  - [ ] Vite 최신 템플릿 사용
  - [ ] 안정적인 라이브러리만 사용
  - [ ] 문제 발생 시 React 18로 다운그레이드

### 7.3 통합 리스크

#### 리스크 6: CORS 설정 오류
- **확률**: 중간
- **영향**: 중간
- **완화 전략**:
  - [ ] Day 2 오후부터 통합 테스트 시작
  - [ ] CORS 미들웨어 사전 설정
  - [ ] Authorization 헤더 전달 테스트

#### 리스크 7: 반응형 디자인 구현 시간 부족
- **확률**: 중간
- **영향**: 낮음
- **완화 전략**:
  - [ ] 간단한 CSS Grid/Flexbox 사용
  - [ ] Tailwind CSS 또는 CSS Modules 활용
  - [ ] 데스크톱 우선 → 모바일 적용 순서

---

## 8. 성공 기준

### 8.1 MVP 출시 성공 기준

#### 필수 달성 항목 (P0)
- [ ] **일정 준수**: 2026-02-14 (금) 오후 3시까지 출시
- [ ] **기능 완성도**: P0 기능 100% 구현
  - [ ] 회원가입 (F-001)
  - [ ] 로그인 (F-002)
  - [ ] 로그아웃 (F-003)
  - [ ] 할일 추가 (F-101)
  - [ ] 할일 조회 (F-102)
  - [ ] 할일 수정 (F-103)
  - [ ] 할일 삭제 (F-104)
  - [ ] 할일 완료 처리 (F-105)
- [ ] **기술 요구사항 충족**:
  - [ ] pg 라이브러리 사용 (Prisma 미사용)
  - [ ] bcrypt 비밀번호 암호화
  - [ ] JWT 인증 구현
  - [ ] PostgreSQL 17 연동
  - [ ] React 19 + TypeScript
- [ ] **품질 기준**:
  - [ ] 로컬 환경에서 정상 동작
  - [ ] 주요 사용자 시나리오 테스트 통과
  - [ ] 치명적 버그 0건
  - [ ] API 응답 시간 < 1초

### 8.2 테스트 시나리오 체크리스트

#### 시나리오 1: 신규 사용자 가입 및 할일 관리
- [ ] 회원가입 성공 (신규 username)
- [ ] 로그인 성공
- [ ] 할일 추가 (제목만)
- [ ] 할일 추가 (제목 + 설명 + 마감일)
- [ ] 할일 목록에서 본인 할일만 표시 확인
- [ ] 할일 완료 처리
- [ ] 할일 수정
- [ ] 할일 삭제 (확인 다이얼로그)
- [ ] 로그아웃

#### 시나리오 2: 에러 처리
- [ ] 중복 username으로 회원가입 시도 → E-001 에러
- [ ] 잘못된 자격증명으로 로그인 시도 → E-002 에러
- [ ] 미인증 상태에서 할일 추가 시도 → E-101 에러
- [ ] 할일 제목 없이 추가 시도 → E-103 에러

#### 시나리오 3: 반응형 테스트
- [ ] 데스크톱 (1920x1080) 정상 표시
- [ ] 태블릿 (768x1024) 정상 표시
- [ ] 모바일 (375x667) 정상 표시

### 8.3 품질 기준

| 항목 | 목표 | 측정 방법 |
|------|------|-----------|
| **기능 완성도** | P0 기능 100% | 기능 체크리스트 |
| **버그 수** | 치명적 버그 0건 | 수동 테스트 |
| **API 응답 시간** | < 1초 | Chrome DevTools Network |
| **코드 품질** | TypeScript 에러 0건 | `tsc --noEmit` |
| **반응형 디자인** | 3개 화면 크기 지원 | DevTools 테스트 |

---

## 9. 프로젝트 구조

### 9.1 백엔드 디렉토리 구조

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
│   ├── models/               # 데이터베이스 모델 (SQL 쿼리)
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
│   ├── config/               # 환경 설정
│   │   └── config.js
│   └── server.js             # 서버 시작점
├── .env                      # 환경 변수
├── .gitignore
├── package.json
└── README.md
```

### 9.2 프론트엔드 디렉토리 구조

```
frontend/
├── src/
│   ├── pages/                # 라우팅되는 페이지
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── TodoList.tsx
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── TodoItem.tsx
│   │   ├── TodoForm.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── hooks/                # 커스텀 훅
│   │   └── useAuth.ts
│   ├── contexts/             # React Context
│   │   └── AuthContext.tsx
│   ├── api/                  # API 호출 함수
│   │   └── api.ts
│   ├── types/                # TypeScript 타입 정의
│   │   ├── auth.ts
│   │   ├── todo.ts
│   │   └── api.ts
│   ├── styles/               # 전역 스타일
│   │   └── globals.css
│   ├── App.tsx               # 루트 컴포넌트
│   └── main.tsx              # 진입점
├── public/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 10. 참고 문서

- [1-domain-definition.md](./1-domain-definition.md): 도메인 정의, 유스케이스, 비즈니스 규칙
- [2-prd.md](./2-prd.md): 제품 요구사항, 기능 정의, 기술 스택
- [3-user-scenario.md](./3-user-scenario.md): 페르소나별 사용자 시나리오
- [4-project-principle.md](./4-project-principle.md): 프로젝트 원칙, 코드 스타일
- [5-arch-diagram.md](./5-arch-diagram.md): 시스템 아키텍처 다이어그램
- [6-ERD.md](./6-ERD.md): 데이터베이스 ERD

---

## 문서 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-02-11 | Project Manager | 초안 작성 (데이터베이스, 백엔드, 프론트엔드 작업 분해) |

---

**🚀 MVP 출시 목표: 2026-02-14 (금) 오후 3시**
**⏰ 남은 개발 시간: 3일**
**🎯 핵심 원칙: 간단하게, 빠르게, 동작하는 제품**
