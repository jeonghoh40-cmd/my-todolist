# E2E 통합 테스트

## 개요

Playwright를 사용한 my-todolist 애플리케이션의 End-to-End 통합 테스트입니다.

**참조 문서**: `docs/3-user-scenario.md`

## 테스트 시나리오

### 1. 신규 사용자 전체 플로우 (`01-new-user-flow.spec.js`)
**시나리오 6.1** 기반

**테스트 단계**:
1. ✅ 회원가입
2. ✅ 로그인
3. ✅ 할일 3개 추가 (제목만 / 제목+설명 / 제목+설명+마감일)
4. ✅ 첫 번째 할일 완료 처리
5. ✅ 두 번째 할일 수정
6. ✅ 세 번째 할일 삭제
7. ✅ 로그아웃
8. ✅ 재로그인 후 데이터 유지 확인

**기능**: F-001, F-002, F-101, F-102, F-103, F-104, F-105

---

### 2. 에러 처리 시나리오 (`02-error-handling.spec.js`)
**시나리오 6.3** 기반

**Phase 1: 회원가입 에러**
- ✅ E-001: 중복 username 에러
- ✅ E-003: 잘못된 이메일 형식 에러

**Phase 2: 로그인 에러**
- ✅ E-002: 잘못된 비밀번호 에러

**Phase 3: 할일 관리 에러**
- ✅ E-103: 제목 없이 할일 추가 시도
- ✅ E-101: 미인증 접근 에러

**에러 코드**: E-001, E-002, E-003, E-101, E-103

---

### 3. 반응형 디자인 테스트 (`03-responsive-design.spec.js`)
**시나리오 6.4** 기반

**테스트 해상도**:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

**기능**:
- 모든 해상도에서 UI 정상 표시
- 모바일에서 할일 추가 동작 확인

---

## 사전 요구사항

### 1. 서버 실행
테스트 실행 전 백엔드와 프론트엔드 서버가 **반드시** 실행 중이어야 합니다.

**백엔드 서버 (Port 3000)**:
```bash
cd backend
npm start
```

**프론트엔드 서버 (Port 5173)**:
```bash
cd frontend
npm run dev
```

### 2. Playwright 설치
```bash
cd test
npm install
npx playwright install chromium
```

---

## 테스트 실행

### 전체 테스트 실행 (Headless)
```bash
cd test
npm test
```

### 브라우저 표시하며 테스트 (Headed)
```bash
cd test
npm run test:headed
```

### 디버그 모드
```bash
cd test
npm run test:debug
```

### 특정 테스트만 실행
```bash
cd test
npx playwright test e2e/01-new-user-flow.spec.js
```

### 테스트 리포트 보기
```bash
cd test
npm run test:report
```

---

## 테스트 결과

### 출력 위치
```
test/e2e/test-results/
├── html-report/          # HTML 리포트
├── results.json          # JSON 결과
└── screenshots/          # 스크린샷
    ├── 01-register-form.png
    ├── 02-login-form.png
    ├── 03-todos-empty.png
    ├── 04-add-todo-1.png
    ├── 05-add-todo-2.png
    ├── 06-add-todo-3.png
    ├── 07-todos-list-3-items.png
    ├── 08-todo-completed.png
    ├── 09-edit-todo.png
    ├── 10-todo-edited.png
    ├── 11-delete-confirm.png
    ├── 12-todo-deleted.png
    ├── 13-logged-out.png
    ├── 14-relogin-data-persist.png
    ├── error-e001-duplicate-username.png
    ├── error-e002-invalid-credentials.png
    ├── error-e003-invalid-email.png
    ├── error-e101-auth-required.png
    ├── error-e103-title-required.png
    ├── error-recovery-success.png
    ├── responsive-desktop-1920x1080.png
    ├── responsive-tablet-768x1024.png
    ├── responsive-mobile-375x667.png
    └── responsive-mobile-add-todo.png
```

---

## 설정

### Playwright 설정 (`playwright.config.js`)

**Base URL**: `http://localhost:5173` (프론트엔드)

**프로젝트**:
- `chromium`: Desktop Chrome
- `mobile-chrome`: Pixel 5
- `tablet`: iPad Pro

**리포터**:
- HTML 리포트
- JSON 리포트
- List (콘솔 출력)

**스크린샷**: 실패 시 자동 저장
**비디오**: 실패 시 자동 저장

---

## 테스트 작성 가이드

### 기본 구조
```javascript
const { test, expect } = require('@playwright/test');

test.describe('테스트 그룹', () => {
  test('테스트 케이스', async ({ page }) => {
    // 페이지 이동
    await page.goto('/login');

    // 입력
    await page.fill('input[name="username"]', 'testuser');

    // 클릭
    await page.click('button:has-text("로그인")');

    // 검증
    await expect(page).toHaveURL(/\/todos/);

    // 스크린샷
    await page.screenshot({ path: './screenshots/test.png' });
  });
});
```

### 선택자 팁
- **텍스트 기반**: `button:has-text("로그인")`
- **이름 속성**: `input[name="username"]`
- **타입 속성**: `input[type="password"]`
- **플레이스홀더**: `input[placeholder*="사용자"]`

### 대기 방법
```javascript
// URL 변경 대기
await page.waitForURL(/\/todos/, { timeout: 5000 });

// 요소 표시 대기
await page.waitForSelector('button:has-text("로그인")');

// 고정 시간 대기 (최소한으로 사용)
await page.waitForTimeout(1000);
```

---

## 트러블슈팅

### 문제: 테스트 실패 - "Target page, context or browser has been closed"
**원인**: 서버가 실행되지 않음

**해결**:
```bash
# 백엔드 서버 확인
curl http://localhost:3000/api

# 프론트엔드 서버 확인
curl http://localhost:5173
```

### 문제: 테스트 타임아웃
**원인**: 네트워크 지연 또는 서버 응답 느림

**해결**:
```javascript
test.setTimeout(120000); // 2분으로 타임아웃 증가
```

### 문제: 스크린샷이 생성되지 않음
**원인**: 디렉토리 권한 또는 경로 문제

**해결**:
```bash
mkdir -p test/e2e/test-results/screenshots
```

### 문제: 중복 username 에러 테스트 실패
**원인**: 이전 테스트 데이터가 DB에 남아있음

**해결**:
- 타임스탬프 기반 랜덤 username 사용 (이미 적용됨)
- 또는 테스트 전 DB 초기화

---

## CI/CD 통합

### GitHub Actions 예시
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '24'

      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
          cd ../test && npm install

      - name: Start servers
        run: |
          cd backend && npm start &
          cd frontend && npm run dev &
          sleep 10

      - name: Run tests
        run: cd test && npm test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test/e2e/test-results/
```

---

## 참고 문서

- [Playwright 공식 문서](https://playwright.dev/)
- [사용자 시나리오 문서](../../docs/3-user-scenario.md)
- [PRD 문서](../../docs/2-prd.md)
- [도메인 정의서](../../docs/1-domain-definition.md)

---

## 테스트 체크리스트

### MVP 출시 전 필수 테스트
- [ ] 신규 사용자 전체 플로우 (15분)
- [ ] 에러 복구 시나리오 (10분)
- [ ] 반응형 디자인 테스트 (5분)

**총 소요 시간**: 약 30-40분

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-02-13 | Test Engineer | 초기 E2E 테스트 작성 (Playwright) |

---

**📋 본 테스트는 docs/3-user-scenario.md를 기반으로 작성되었습니다.**
**🎯 MVP 출시 목표: 2026-02-14 (금) 오후 3시**
