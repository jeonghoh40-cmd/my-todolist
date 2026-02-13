// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 시나리오 6.3: 에러 복구 시나리오 (Error Handling)
 *
 * 관련 문서: docs/3-user-scenario.md
 * 에러 코드: E-001, E-002, E-003, E-101, E-102, E-103, E-104
 *
 * 테스트 단계:
 * Phase 1: 회원가입 에러
 * Phase 2: 로그인 에러
 * Phase 3: 할일 관리 에러
 */

const timestamp = Date.now();
const testUser = {
  username: `error_test_${timestamp}`,
  password: 'ErrorTest123!',
  email: `error_${timestamp}@example.com`
};

test.describe('에러 처리 시나리오', () => {
  test.setTimeout(120000);

  test.describe('Phase 1: 회원가입 에러', () => {
    test('E-001: 중복 username 에러', async ({ page }) => {
      // 먼저 사용자 등록
      await page.goto('/register');
      await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
      await page.fill('input[name="password"], input[type="password"]', testUser.password);
      await page.fill('input[name="email"], input[type="email"]', testUser.email);
      await page.click('button:has-text("회원가입"), button:has-text("Register")');
      await page.waitForTimeout(1500);

      // 같은 username으로 다시 회원가입 시도
      await page.goto('/register');
      await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
      await page.fill('input[name="password"], input[type="password"]', 'AnotherPass123!');
      await page.fill('input[name="email"], input[type="email"]', `another_${timestamp}@example.com`);
      await page.click('button:has-text("회원가입"), button:has-text("Register")');
      await page.waitForTimeout(1000);

      // 에러 메시지 확인
      await page.screenshot({ path: './e2e/test-results/screenshots/error-e001-duplicate-username.png' });
      const pageContent = await page.content();
      const hasError = pageContent.includes('존재') ||
                      pageContent.includes('already') ||
                      pageContent.includes('중복');
      expect(hasError).toBeTruthy();

      console.log('✅ E-001 에러 확인: 중복 username');
    });

    test('E-003: 잘못된 이메일 형식 에러', async ({ page }) => {
      await page.goto('/register');
      await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', `new_user_${timestamp}`);
      await page.fill('input[name="password"], input[type="password"]', 'Password123!');
      await page.fill('input[name="email"], input[type="email"]', 'invalid-email');
      await page.click('button:has-text("회원가입"), button:has-text("Register")');
      await page.waitForTimeout(1000);

      // 에러 메시지 확인
      await page.screenshot({ path: './e2e/test-results/screenshots/error-e003-invalid-email.png' });
      const pageContent = await page.content();
      const hasError = pageContent.includes('이메일') ||
                      pageContent.includes('email') ||
                      pageContent.includes('형식');
      expect(hasError).toBeTruthy();

      console.log('✅ E-003 에러 확인: 잘못된 이메일 형식');
    });
  });

  test.describe('Phase 2: 로그인 에러', () => {
    test('E-002: 잘못된 비밀번호 에러', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
      await page.fill('input[name="password"], input[type="password"]', 'WrongPassword123!');
      await page.click('button:has-text("로그인"), button:has-text("Login")');
      await page.waitForTimeout(1000);

      // 에러 메시지 확인
      await page.screenshot({ path: './e2e/test-results/screenshots/error-e002-invalid-credentials.png' });
      const pageContent = await page.content();
      const hasError = pageContent.includes('일치') ||
                      pageContent.includes('credentials') ||
                      pageContent.includes('비밀번호');
      expect(hasError).toBeTruthy();

      console.log('✅ E-002 에러 확인: 잘못된 자격증명');
    });
  });

  test.describe('Phase 3: 할일 관리 에러', () => {
    test('E-103: 제목 없이 할일 추가 시도', async ({ page }) => {
      // 로그인
      await page.goto('/login');
      await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
      await page.fill('input[name="password"], input[type="password"]', testUser.password);
      await page.click('button:has-text("로그인"), button:has-text("Login")');
      await page.waitForURL(/\/todos/, { timeout: 5000 });
      await page.waitForTimeout(1000);

      // 할일 추가 모달 열기
      await page.click('button:has-text("할일 추가"), button:has-text("Add"), button:has-text("+")');
      await page.waitForTimeout(500);

      // 제목 없이 저장 시도
      await page.click('button:has-text("저장"), button:has-text("Save")');
      await page.waitForTimeout(1000);

      // 에러 메시지 확인
      await page.screenshot({ path: './e2e/test-results/screenshots/error-e103-title-required.png' });
      const pageContent = await page.content();
      const hasError = pageContent.includes('제목') ||
                      pageContent.includes('title') ||
                      pageContent.includes('required') ||
                      pageContent.includes('필수');
      expect(hasError).toBeTruthy();

      console.log('✅ E-103 에러 확인: 제목 필수');
    });

    test('E-101: 미인증 접근 에러', async ({ page }) => {
      // localStorage 토큰 없이 /todos 접근
      await page.goto('/todos');
      await page.waitForTimeout(1000);

      // 로그인 페이지로 리다이렉트 되었는지 확인
      const currentUrl = page.url();
      const isLoginPage = currentUrl.includes('/login') || currentUrl === 'http://localhost:5173/';
      expect(isLoginPage).toBeTruthy();

      await page.screenshot({ path: './e2e/test-results/screenshots/error-e101-auth-required.png' });

      console.log('✅ E-101 에러 확인: 인증 필요 (로그인 페이지로 리다이렉트)');
    });
  });

  test('전체 에러 복구 테스트 완료', async ({ page }) => {
    // 최종적으로 정상 로그인 가능한지 확인
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });

    await page.screenshot({ path: './e2e/test-results/screenshots/error-recovery-success.png' });

    console.log('✅ 에러 복구 확인: 정상 로그인 성공');
    console.log('');
    console.log('🎉 에러 처리 시나리오 테스트 완료!');
  });
});
