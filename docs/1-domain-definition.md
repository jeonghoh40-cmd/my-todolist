# 도메인 정의서 - my-todolist

## 1. 프로젝트 개요

### 1.1 프로젝트 명
my-todolist - 인증 기반 일정관리 애플리케이션

### 1.2 목적
개인 사용자가 인증된 환경에서 안전하게 일정을 관리할 수 있는 브라우저 기반 애플리케이션 제공

### 1.3 핵심 가치
- 사용자별 독립적인 일정 관리
- 인증을 통한 데이터 보안
- 직관적인 일정 등록 및 관리

---

## 2. 핵심 도메인 (Core Domain)

### 2.1 도메인 구조
```
my-todolist
├── 사용자 관리 (User Management)
│   ├── 회원 등록
│   └── 로그인/로그아웃
│
└── 할일 관리 (Todo Management)
    ├── 할일 생성
    ├── 할일 조회
    ├── 할일 수정
    ├── 할일 삭제
    └── 할일 완료 처리
```

### 2.2 도메인 경계
- **사용자 관리**: 회원 가입, 인증, 세션 관리
- **할일 관리**: 인증된 사용자의 할일 CRUD 및 상태 관리

---

## 3. 주요 엔티티 (Entities)

### 3.1 User (사용자)
| 속성 | 타입 | 설명 | 필수 |
|------|------|------|------|
| id | Long | 사용자 고유 식별자 | Y |
| username | String | 사용자명 (로그인 ID) | Y |
| password | String | 비밀번호 (암호화) | Y |
| email | String | 이메일 주소 | Y |
| createdAt | DateTime | 가입일시 | Y |

### 3.2 Todo (할일)
| 속성 | 타입 | 설명 | 필수 |
|------|------|------|------|
| id | Long | 할일 고유 식별자 | Y |
| userId | Long | 작성자 ID | Y |
| title | String | 할일 제목 | Y |
| description | String | 할일 상세 내용 | N |
| dueDate | Date | 마감 날짜 | N |
| isCompleted | Boolean | 완료 여부 | Y |
| createdAt | DateTime | 생성일시 | Y |
| updatedAt | DateTime | 수정일시 | Y |

---

## 4. 비즈니스 규칙 (Business Rules)

### 4.1 사용자 관리 규칙
- **BR-001**: 회원 등록은 누구나 가능하다
- **BR-002**: username은 시스템 내에서 고유해야 한다
- **BR-003**: 비밀번호는 암호화하여 저장해야 한다
- **BR-004**: 로그인 시 유효한 자격증명을 검증해야 한다

### 4.2 할일 관리 규칙
- **BR-101**: 할일 생성은 인증된 사용자만 가능하다
- **BR-102**: 사용자는 본인이 생성한 할일만 조회/수정/삭제할 수 있다
- **BR-103**: 할일 제목은 필수 입력 항목이다
- **BR-104**: 마감 날짜는 선택적으로 등록 가능하다
- **BR-105**: 완료 처리된 할일은 isCompleted = true로 상태 변경된다
- **BR-106**: 할일 수정 시 updatedAt이 자동 갱신된다

### 4.3 비즈니스 규칙 적용 매트릭스

| BR | 적용 UC | 검증 계층 | 실패 시 에러 |
|------|----------|-----------|--------------|
| BR-001 | UC-001 | Service Layer | - |
| BR-002 | UC-001 | Service Layer | E-001 |
| BR-003 | UC-001 | Service Layer | - |
| BR-004 | UC-002 | Service Layer | E-002 |
| BR-101 | UC-101, UC-102, UC-103, UC-104, UC-105 | Middleware | E-101 |
| BR-102 | UC-102, UC-103, UC-104, UC-105 | Service Layer | E-102 |
| BR-103 | UC-101, UC-103 | DTO Validation | E-103 |
| BR-104 | UC-101, UC-103 | DTO Validation | - |
| BR-105 | UC-105 | Service Layer | - |
| BR-106 | UC-103, UC-105 | Service Layer | - |

---

## 5. 유스케이스 (Use Cases)

### 5.1 사용자 관리
**UC-001: 회원 등록**
- **Actor**: 미등록 사용자
- **Precondition**: 없음
- **Input**: username, password, email
- **Output**: 등록 성공/실패 메시지
- **Success Criteria**:
  - HTTP 201 Created 반환
  - 응답에 userId 포함
  - DB에 암호화된 비밀번호 저장 확인
- **Flow**:
  1. 사용자가 회원 정보를 입력한다
  2. 시스템이 username 중복을 확인한다
  3. 비밀번호를 암호화하여 저장한다
  4. 회원 등록을 완료한다
- **Alternative Flow 1**: username 중복
  - 2a. 입력한 username이 이미 존재함
  - 2b. 시스템이 E-001 에러 반환 (HTTP 409 Conflict)
  - 2c. 유스케이스 종료
- **Alternative Flow 2**: 유효하지 않은 이메일 형식
  - 1a. 이메일 형식이 RFC 5322를 위반함
  - 1b. 시스템이 E-003 에러 반환 (HTTP 400 Bad Request)
  - 1c. 유스케이스 종료

**UC-002: 로그인**
- **Actor**: 등록된 사용자
- **Precondition**: 회원 등록 완료
- **Input**: username, password
- **Output**: 인증 토큰 또는 세션
- **Success Criteria**:
  - HTTP 200 OK 반환
  - JWT 토큰 발급
  - 토큰 유효기간 24시간
- **Flow**:
  1. 사용자가 자격증명을 입력한다
  2. 시스템이 자격증명을 검증한다
  3. 인증 토큰/세션을 발급한다
- **Alternative Flow 1**: 잘못된 자격증명
  - 2a. username 또는 password가 일치하지 않음
  - 2b. 시스템이 E-002 에러 반환 (HTTP 401 Unauthorized)
  - 2c. 유스케이스 종료
- **Alternative Flow 2**: 존재하지 않는 사용자
  - 2a. 입력한 username이 DB에 없음
  - 2b. 시스템이 E-002 에러 반환 (HTTP 401 Unauthorized)
  - 2c. 유스케이스 종료

### 5.2 할일 관리
**UC-101: 할일 추가**
- **Actor**: 인증된 사용자
- **Precondition**: 로그인 완료
- **Input**: title, description (optional), dueDate (optional)
- **Output**: 생성된 할일 정보
- **Success Criteria**:
  - HTTP 201 Created 반환
  - 응답에 todoId, userId, createdAt 포함
  - isCompleted = false로 초기화
- **Flow**:
  1. 사용자가 할일 정보를 입력한다
  2. 시스템이 인증 상태를 확인한다
  3. 할일을 생성하고 userId를 연결한다
  4. 생성된 할일을 반환한다
- **Alternative Flow 1**: 미인증 사용자
  - 2a. 유효한 인증 토큰이 없음
  - 2b. 시스템이 E-101 에러 반환 (HTTP 401 Unauthorized)
  - 2c. 유스케이스 종료
- **Alternative Flow 2**: 제목 누락
  - 1a. title 필드가 비어있거나 null
  - 1b. 시스템이 E-103 에러 반환 (HTTP 400 Bad Request)
  - 1c. 유스케이스 종료

**UC-102: 할일 조회**
- **Actor**: 인증된 사용자
- **Precondition**: 로그인 완료
- **Input**: 없음 (또는 필터 조건)
- **Output**: 사용자의 할일 목록
- **Success Criteria**:
  - HTTP 200 OK 반환
  - 본인의 할일만 포함된 배열 반환
  - 빈 배열 가능 (할일이 없는 경우)
- **Flow**:
  1. 시스템이 인증 상태를 확인한다
  2. 현재 사용자의 할일 목록을 조회한다
  3. 할일 목록을 반환한다
- **Alternative Flow 1**: 미인증 사용자
  - 1a. 유효한 인증 토큰이 없음
  - 1b. 시스템이 E-101 에러 반환 (HTTP 401 Unauthorized)
  - 1c. 유스케이스 종료

**UC-103: 할일 수정**
- **Actor**: 인증된 사용자
- **Precondition**: 로그인 완료, 수정할 할일 존재
- **Input**: todoId, 수정할 필드 정보
- **Output**: 수정된 할일 정보
- **Success Criteria**:
  - HTTP 200 OK 반환
  - updatedAt이 현재 시각으로 갱신됨
  - 수정된 할일 정보 반환
- **Flow**:
  1. 시스템이 인증 상태를 확인한다
  2. 할일의 소유권을 검증한다
  3. 할일 정보를 업데이트한다
  4. updatedAt을 갱신한다
- **Alternative Flow 1**: 미인증 사용자
  - 1a. 유효한 인증 토큰이 없음
  - 1b. 시스템이 E-101 에러 반환 (HTTP 401 Unauthorized)
  - 1c. 유스케이스 종료
- **Alternative Flow 2**: 소유권 없음
  - 2a. todoId의 userId가 현재 사용자와 불일치
  - 2b. 시스템이 E-102 에러 반환 (HTTP 403 Forbidden)
  - 2c. 유스케이스 종료
- **Alternative Flow 3**: 존재하지 않는 할일
  - 2a. todoId에 해당하는 할일이 DB에 없음
  - 2b. 시스템이 E-104 에러 반환 (HTTP 404 Not Found)
  - 2c. 유스케이스 종료

**UC-104: 할일 삭제**
- **Actor**: 인증된 사용자
- **Precondition**: 로그인 완료, 삭제할 할일 존재
- **Input**: todoId
- **Output**: 삭제 성공/실패 메시지
- **Success Criteria**:
  - HTTP 204 No Content 반환
  - DB에서 할일 레코드 삭제됨
  - 영구 삭제 (hard delete)
- **Flow**:
  1. 시스템이 인증 상태를 확인한다
  2. 할일의 소유권을 검증한다
  3. 할일을 삭제한다
- **Alternative Flow 1**: 미인증 사용자
  - 1a. 유효한 인증 토큰이 없음
  - 1b. 시스템이 E-101 에러 반환 (HTTP 401 Unauthorized)
  - 1c. 유스케이스 종료
- **Alternative Flow 2**: 소유권 없음
  - 2a. todoId의 userId가 현재 사용자와 불일치
  - 2b. 시스템이 E-102 에러 반환 (HTTP 403 Forbidden)
  - 2c. 유스케이스 종료
- **Alternative Flow 3**: 존재하지 않는 할일
  - 2a. todoId에 해당하는 할일이 DB에 없음
  - 2b. 시스템이 E-104 에러 반환 (HTTP 404 Not Found)
  - 2c. 유스케이스 종료

**UC-105: 할일 완료 처리**
- **Actor**: 인증된 사용자
- **Precondition**: 로그인 완료, 처리할 할일 존재
- **Input**: todoId
- **Output**: 완료 처리된 할일 정보
- **Success Criteria**:
  - HTTP 200 OK 반환
  - isCompleted = true로 변경됨
  - updatedAt이 현재 시각으로 갱신됨
- **Flow**:
  1. 시스템이 인증 상태를 확인한다
  2. 할일의 소유권을 검증한다
  3. isCompleted를 true로 변경한다
  4. updatedAt을 갱신한다
- **Alternative Flow 1**: 미인증 사용자
  - 1a. 유효한 인증 토큰이 없음
  - 1b. 시스템이 E-101 에러 반환 (HTTP 401 Unauthorized)
  - 1c. 유스케이스 종료
- **Alternative Flow 2**: 소유권 없음
  - 2a. todoId의 userId가 현재 사용자와 불일치
  - 2b. 시스템이 E-102 에러 반환 (HTTP 403 Forbidden)
  - 2c. 유스케이스 종료
- **Alternative Flow 3**: 존재하지 않는 할일
  - 2a. todoId에 해당하는 할일이 DB에 없음
  - 2b. 시스템이 E-104 에러 반환 (HTTP 404 Not Found)
  - 2c. 유스케이스 종료

---

## 6. 도메인 용어집

| 용어 | 정의 |
|------|------|
| 사용자 | 시스템에 등록된 회원 |
| 인증 | 사용자의 신원을 확인하는 프로세스 |
| 할일 | 사용자가 관리하는 작업 단위 |
| 완료 처리 | 할일의 완료 상태를 표시하는 작업 |
| 마감 날짜 | 할일의 목표 완료 일자 |
| 소유권 | 사용자가 본인의 할일에 대해 갖는 독점적 권한 |

---

## 7. 에러 코드 정의

| 코드 | 메시지 | HTTP Status | 발생 조건 | 관련 BR |
|------|--------|-------------|-----------|---------|
| E-001 | Username already exists | 409 Conflict | username 중복 시 | BR-002 |
| E-002 | Invalid credentials | 401 Unauthorized | 로그인 실패 시 | BR-004 |
| E-003 | Invalid email format | 400 Bad Request | 이메일 형식 오류 | - |
| E-101 | Authentication required | 401 Unauthorized | 미인증 상태에서 할일 접근 | BR-101 |
| E-102 | Access denied | 403 Forbidden | 타인의 할일 접근 시도 | BR-102 |
| E-103 | Title is required | 400 Bad Request | 할일 제목 누락 | BR-103 |
| E-104 | Todo not found | 404 Not Found | 존재하지 않는 todoId | - |

---

## 8. 제약사항 및 고려사항

### 8.1 기술적 제약사항
- 브라우저 기반 애플리케이션으로 구현
- 인증 메커니즘 필수 구현

### 8.2 보안 고려사항
- 비밀번호 암호화 저장 (bcrypt 권장, cost factor 10 이상)
- 인증된 사용자만 할일 접근 가능
- 사용자별 데이터 격리
- JWT 토큰은 httpOnly 쿠키 저장 권장

### 8.3 향후 확장 가능성
- 할일 카테고리/태그 기능
- 할일 우선순위 설정
- 할일 검색/필터링 기능
- 알림/리마인더 기능
- 할일 공유 기능

---

## 9. 아키텍처 결정 기록 (ADR)

### ADR-001: 인증 방식으로 JWT 선택

**상태**: 승인됨
**날짜**: 2026-02-10
**의사결정자**: 개발팀

**컨텍스트**:
- 브라우저 기반 SPA 환경에서 사용자 인증 메커니즘 필요
- Session 기반 vs JWT 토큰 기반 인증 중 선택 필요
- 향후 모바일 앱 확장 가능성 존재

**결정**:
JWT (JSON Web Token) 토큰 기반 인증 방식을 채택한다.

**근거**:
- **Stateless 아키텍처**: 서버에 세션 저장소 불필요, 수평 확장 용이
- **크로스 플랫폼**: 동일한 토큰을 웹/모바일에서 재사용 가능
- **API 친화적**: RESTful API 설계 원칙과 부합
- **마이크로서비스 대응**: 향후 서비스 분리 시 토큰 검증만으로 인증 가능

**결과**:
- 토큰 관리 로직 구현 필요 (발급, 검증, 갱신)
- 리프레시 토큰 전략 필요 (액세스 토큰 만료 시)
- XSS 방지를 위해 httpOnly 쿠키에 저장
- 토큰 유효기간: 24시간

**대안**:
- Session 기반 인증: 서버 메모리 사용, Redis 등 세션 스토어 필요

---

### ADR-002: 할일 삭제 전략으로 Hard Delete 선택

**상태**: 승인됨
**날짜**: 2026-02-10
**의사결정자**: 개발팀

**컨텍스트**:
- 사용자가 할일을 삭제할 때 데이터 처리 방식 결정 필요
- Hard Delete (물리적 삭제) vs Soft Delete (논리적 삭제) 중 선택

**결정**:
Hard Delete 방식을 채택한다. (DB에서 레코드 완전 삭제)

**근거**:
- **데이터 최소화 원칙**: GDPR 등 개인정보 보호 규정 준수
- **단순한 구조**: 삭제 플래그(deletedAt) 관리 불필요, 쿼리 복잡도 감소
- **명확한 UX**: 삭제 = 영구 삭제로 사용자 기대와 일치
- **초기 MVP**: 복구 기능이 필수 요구사항이 아님

**결과**:
- 삭제 전 확인 UI 필수 구현 ("정말 삭제하시겠습니까?")
- 삭제된 데이터 복구 불가능
- 감사 로그가 필요한 경우 별도 로그 테이블 구성

**대안**:
- Soft Delete: deletedAt 컬럼 추가, 복구 기능 제공 가능하나 구조 복잡

---

### ADR-003: 비밀번호 암호화 알고리즘으로 bcrypt 선택

**상태**: 승인됨
**날짜**: 2026-02-10
**의사결정자**: 개발팀

**컨텍스트**:
- 사용자 비밀번호를 안전하게 저장하기 위한 암호화 알고리즘 선택 필요
- bcrypt, PBKDF2, Argon2, scrypt 등 여러 옵션 존재

**결정**:
bcrypt 알고리즘 (cost factor 10 이상)을 채택한다.

**근거**:
- **업계 표준**: 가장 널리 사용되고 검증된 알고리즘
- **레인보우 테이블 방어**: 자동 솔트(salt) 생성으로 안전성 보장
- **적응적 해시 함수**: cost factor 조정으로 향후 하드웨어 발전에 대응
- **라이브러리 지원**: 대부분의 프로그래밍 언어에서 안정적인 라이브러리 제공

**결과**:
- 회원가입 시 bcrypt 해시 처리 (약 100-200ms 소요)
- 비밀번호 검증 시 동일 알고리즘으로 비교
- 저장된 해시 형식: `$2a$10$...` (60자)
- cost factor는 성능 테스트 후 조정 가능 (10~12 권장)

**대안**:
- Argon2: 최신 알고리즘이나 라이브러리 성숙도가 낮음
- PBKDF2: NIST 승인이나 GPU 공격에 상대적으로 취약
