# E2E 테스트 가이드

## 테스트 환경 준비

### 1. 서버 실행 확인

**백엔드 서버** (포트 3000)
```bash
cd backend
npm run dev
```
- Health Check: http://localhost:3000/api/health
- API Docs: http://localhost:3000/api-docs

**프론트엔드 서버** (포트 5173 또는 5174)
```bash
cd frontend
npm run dev
```
- 프론트엔드: http://localhost:5174 (포트는 자동 할당될 수 있음)

### 2. 데이터베이스 확인

PostgreSQL이 실행 중이고 `my_todolist` 데이터베이스가 생성되어 있는지 확인:

```bash
psql -U postgres -d my_todolist -c "SELECT COUNT(*) FROM users;"
```

---

## Task 5.2.1: 사용자 시나리오 1 - 신규 사용자 전체 플로우

### 테스트 절차

#### 1단계: 회원가입

1. 브라우저에서 http://localhost:5174 접속
2. "계정이 없으신가요? 회원가입" 클릭
3. 회원가입 폼 입력:
   - **Username**: test_user_001
   - **Password**: test1234
   - **Email**: test001@example.com
4. "회원가입" 버튼 클릭

**✅ 예상 결과:**
- 로그인 페이지로 자동 리다이렉트
- 성공 메시지 표시 (선택사항)

**❌ 실패 시 확인:**
- 네트워크 탭에서 POST /api/auth/register 요청 확인
- 응답 상태: 201 Created
- 에러 메시지 확인

---

#### 2단계: 로그인

1. 로그인 페이지에서 입력:
   - **Username**: test_user_001
   - **Password**: test1234
2. "로그인" 버튼 클릭

**✅ 예상 결과:**
- 할일 목록 페이지로 리다이렉트 (/todos)
- 상단에 사용자 이름 표시: "test_user_001님 환영합니다"
- 빈 할일 목록: "할일이 없습니다. 새로운 할일을 추가해보세요!"

**❌ 실패 시 확인:**
- 네트워크 탭: POST /api/auth/login → 200 OK
- localStorage에 token, user 저장 확인 (개발자 도구 → Application → Local Storage)

---

#### 3단계: 할일 추가 (제목만)

1. "+ 할일 추가" 버튼 클릭
2. 모달 폼 입력:
   - **제목**: 첫 번째 할일
   - **설명**: (비워둠)
   - **마감일**: (비워둠)
3. "저장" 버튼 클릭

**✅ 예상 결과:**
- 모달 닫힘
- 할일 목록에 새 카드 표시
- 제목: "첫 번째 할일"
- 완료 체크박스: 미체크 상태
- 설명, 마감일 없음

**❌ 실패 시 확인:**
- 네트워크 탭: POST /api/todos → 201 Created
- Authorization 헤더에 Bearer 토큰 포함 확인

---

#### 4단계: 할일 추가 (제목 + 설명)

1. "+ 할일 추가" 버튼 클릭
2. 모달 폼 입력:
   - **제목**: 두 번째 할일
   - **설명**: 설명이 있는 할일입니다
   - **마감일**: (비워둠)
3. "저장" 버튼 클릭

**✅ 예상 결과:**
- 할일 목록에 새 카드 추가
- 설명이 표시됨

---

#### 5단계: 할일 추가 (제목 + 설명 + 마감일)

1. "+ 할일 추가" 버튼 클릭
2. 모달 폼 입력:
   - **제목**: 세 번째 할일
   - **설명**: 마감일이 있는 할일입니다
   - **마감일**: 2026-02-20 (날짜 선택)
3. "저장" 버튼 클릭

**✅ 예상 결과:**
- 할일 목록에 새 카드 추가
- 마감일이 "2026-02-20" 형식으로 표시됨

---

#### 6단계: 할일 완료 처리

1. "첫 번째 할일" 카드에서 체크박스 클릭

**✅ 예상 결과:**
- 체크박스가 체크됨
- 카드 배경이 회색(#f8f9fa)으로 변경
- 제목에 취소선 표시
- 네트워크 탭: PATCH /api/todos/1/complete → 200 OK

---

#### 7단계: 할일 수정

1. "두 번째 할일" 카드에서 "수정" 버튼 클릭
2. 모달 폼에서 수정:
   - **제목**: 두 번째 할일 (수정됨)
   - **설명**: 수정된 설명입니다
3. "저장" 버튼 클릭

**✅ 예상 결과:**
- 모달 닫힘
- 할일 카드가 새 내용으로 업데이트됨
- 네트워크 탭: PUT /api/todos/2 → 200 OK

---

#### 8단계: 할일 삭제

1. "세 번째 할일" 카드에서 "삭제" 버튼 클릭
2. 확인 다이얼로그에서 "삭제" 클릭

**✅ 예상 결과:**
- 다이얼로그 닫힘
- 할일 카드가 목록에서 제거됨
- 네트워크 탭: DELETE /api/todos/3 → 204 No Content

---

#### 9단계: 로그아웃

1. 상단 "로그아웃" 버튼 클릭

**✅ 예상 결과:**
- 로그인 페이지로 리다이렉트
- localStorage에서 token, user 제거됨

---

#### 10단계: 재로그인 후 데이터 유지 확인

1. 로그인:
   - Username: test_user_001
   - Password: test1234
2. 로그인 성공

**✅ 예상 결과:**
- 할일 목록 페이지로 이동
- 이전에 추가한 할일 2개 표시됨:
  - "첫 번째 할일" (완료 상태)
  - "두 번째 할일 (수정됨)"
- "세 번째 할일"은 삭제되어 표시되지 않음

---

## Task 5.2.2: 사용자 시나리오 2 - 에러 처리

### 1. E-001: 중복 username

1. 로그아웃 후 회원가입 페이지 이동
2. 입력:
   - Username: test_user_001 (이미 존재)
   - Password: test1234
   - Email: test002@example.com
3. "회원가입" 클릭

**✅ 예상 결과:**
- 에러 메시지 표시: "이미 존재하는 사용자명입니다"
- 네트워크 탭: 409 Conflict
- 응답 body: `{ "error": "E-001", "message": "..." }`

---

### 2. E-002: 잘못된 자격증명

1. 로그인 페이지에서 입력:
   - Username: test_user_001
   - Password: wrongpassword
2. "로그인" 클릭

**✅ 예상 결과:**
- 에러 메시지 표시: "아이디 또는 비밀번호가 일치하지 않습니다"
- 네트워크 탭: 401 Unauthorized
- 응답 body: `{ "error": "E-002", "message": "..." }`

---

### 3. E-003: 잘못된 이메일 형식

1. 회원가입 페이지에서 입력:
   - Username: test_user_002
   - Password: test1234
   - Email: invalidemail (@ 없음)
2. "회원가입" 클릭

**✅ 예상 결과:**
- 에러 메시지 표시: "유효하지 않은 이메일 형식입니다"
- 네트워크 탭: 400 Bad Request
- 응답 body: `{ "error": "E-003", "message": "..." }`

---

### 4. E-101: 미인증 상태에서 할일 추가

1. 로그아웃
2. 브라우저 개발자 도구 → Console 열기
3. 다음 코드 실행:
```javascript
fetch('http://localhost:3000/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: '테스트' })
}).then(res => res.json()).then(console.log);
```

**✅ 예상 결과:**
- 응답: `{ "error": "E-101", "message": "Authentication required" }`
- 상태 코드: 401

---

### 5. E-102: 타인의 할일 접근

이 테스트는 두 개의 계정이 필요합니다:

1. 첫 번째 계정 (test_user_001)으로 로그인
2. 할일 추가 (예: "나의 할일")
3. 네트워크 탭에서 할일 ID 확인 (예: id: 5)
4. 로그아웃
5. 두 번째 계정 (test_user_003) 회원가입 및 로그인
6. 개발자 도구 → Console에서 실행:
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:3000/api/todos/5', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json()).then(console.log);
```

**✅ 예상 결과:**
- 응답: `{ "error": "E-102", "message": "Access denied" }`
- 상태 코드: 403

---

### 6. E-103: 제목 없이 할일 추가

1. 로그인 상태에서 "+ 할일 추가" 클릭
2. 제목을 비워둔 채 "저장" 클릭

**✅ 예상 결과:**
- 에러 메시지 표시: "제목은 필수입니다"
- 네트워크 탭: 400 Bad Request
- 응답 body: `{ "error": "E-103", "message": "..." }`

---

### 7. E-104: 존재하지 않는 할일 수정

1. 로그인 상태
2. 개발자 도구 → Console에서 실행:
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:3000/api/todos/99999', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title: '존재하지 않는 할일' })
}).then(res => res.json()).then(console.log);
```

**✅ 예상 결과:**
- 응답: `{ "error": "E-104", "message": "Todo not found" }`
- 상태 코드: 404

---

## Task 5.2.3: 반응형 디자인 테스트

### 1. 모바일 뷰 (375x667)

1. Chrome DevTools 열기 (F12)
2. Toggle Device Toolbar 클릭 (Ctrl+Shift+M)
3. 디바이스 선택: iPhone SE 또는 사용자 정의 (375x667)

**테스트 항목:**
- [ ] 회원가입 페이지 정상 표시 (입력 필드가 화면에 맞게 표시)
- [ ] 로그인 페이지 정상 표시
- [ ] 할일 목록이 세로 1열로 표시
- [ ] 할일 추가 모달이 전체 화면 또는 하단 시트로 표시
- [ ] 버튼 크기가 터치하기 충분함 (44x44px 이상)
- [ ] 텍스트가 읽기 쉬움 (적절한 폰트 크기)

---

### 2. 태블릿 뷰 (768x1024)

1. Chrome DevTools → 디바이스 선택: iPad Mini
2. 또는 사용자 정의: 768x1024

**테스트 항목:**
- [ ] 할일 목록이 2열 그리드로 표시
- [ ] 모달이 화면 중앙에 표시 (오버레이)
- [ ] 레이아웃이 깨지지 않음

---

### 3. 데스크톱 뷰 (1920x1080)

1. Chrome DevTools → 반응형 모드 해제
2. 브라우저 전체 화면

**테스트 항목:**
- [ ] 할일 목록이 2-3열 그리드로 표시
- [ ] 컨텐츠가 중앙 정렬됨
- [ ] 모달이 화면 중앙에 적절한 크기로 표시
- [ ] 여백이 충분함

---

### 4. 가로 모드 테스트

1. Chrome DevTools → 디바이스 회전 (Rotate 아이콘)
2. 또는 사용자 정의: 667x375 (가로)

**테스트 항목:**
- [ ] 레이아웃이 가로 모드에 맞게 조정됨
- [ ] 스크롤 가능
- [ ] 모달이 화면에 맞게 표시

---

## 체크리스트

### Task 5.2.1 완료 조건
- [ ] 회원가입 (username: test_user_001)
- [ ] 로그인 성공
- [ ] 할일 3개 추가 (제목만, 제목+설명, 제목+설명+마감일)
- [ ] 첫 번째 할일 완료 처리 (체크박스)
- [ ] 두 번째 할일 수정
- [ ] 세 번째 할일 삭제 (확인 다이얼로그)
- [ ] 로그아웃
- [ ] 재로그인 후 데이터 유지 확인

### Task 5.2.2 완료 조건
- [ ] E-001: 중복 username으로 회원가입 → 에러 메시지 확인
- [ ] E-002: 잘못된 자격증명으로 로그인 → 에러 메시지 확인
- [ ] E-003: 잘못된 이메일 형식 → 에러 메시지 확인
- [ ] E-101: 미인증 상태에서 할일 추가 → 로그인 리다이렉트
- [ ] E-102: 타인의 할일 접근 → 403 에러
- [ ] E-103: 제목 없이 할일 추가 → 에러 메시지 확인
- [ ] E-104: 존재하지 않는 할일 수정 → 에러 메시지 확인

### Task 5.2.3 완료 조건
- [ ] Chrome DevTools → 모바일 뷰 (375x667) 정상 표시
- [ ] 태블릿 뷰 (768x1024) 정상 표시
- [ ] 데스크톱 뷰 (1920x1080) 정상 표시
- [ ] 가로 모드 정상 표시
- [ ] 모든 화면 크기에서 기능 정상 동작

---

## 네트워크 디버깅

### Chrome DevTools 사용법

1. F12 키로 개발자 도구 열기
2. Network 탭 선택
3. "Preserve log" 체크 (페이지 이동 시 로그 유지)
4. "Disable cache" 체크 (캐시 비활성화)

### 확인 사항

#### 요청 헤더
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### 응답 상태 코드
- 200: 성공
- 201: 생성 성공
- 204: 삭제 성공 (본문 없음)
- 400: 잘못된 요청
- 401: 인증 필요
- 403: 접근 권한 없음
- 404: 리소스를 찾을 수 없음
- 409: 충돌 (중복 username)

---

## 트러블슈팅

### 문제: CORS 에러

**증상:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**해결:**
1. 백엔드 서버가 실행 중인지 확인
2. backend/src/server.js의 CORS 설정 확인
3. 프론트엔드 포트와 백엔드 CORS origin이 일치하는지 확인

---

### 문제: 로그인 후 빈 화면

**원인:** 토큰이 localStorage에 저장되지 않음

**해결:**
1. 브라우저 개발자 도구 → Application → Local Storage 확인
2. AuthContext의 login 함수 확인
3. Console에서 에러 메시지 확인

---

### 문제: API 호출 실패 (네트워크 에러)

**확인 사항:**
1. 백엔드 서버 실행 중? → `npm run dev`
2. 포트 확인: 3000번 포트
3. Health check: http://localhost:3000/api/health

---

## 테스트 완료 기준

모든 체크박스가 체크되고, 치명적 버그가 없으면 Task 5.2 완료!

**테스트 결과 보고:**
- 성공한 시나리오 수
- 발견된 버그 (있다면)
- 개선 제안 (있다면)
