// @ts-check
const { test, expect, devices } = require('@playwright/test');

/**
 * 시나리오 6.4: 반응형 디자인 테스트 (Cross-Device)
 *
 * 관련 문서: docs/3-user-scenario.md
 *
 * 테스트 단계:
 * 1. Desktop (1920x1080)
 * 2. Tablet (768x1024)
 * 3. Mobile (375x667)
 */

const timestamp = Date.now();
const testUser = {
  username: `responsive_${timestamp}`,
  password: 'ResponsiveTest123!',
  email: `responsive_${timestamp}@example.com`
};

test.describe('반응형 디자인 테스트', () => {
  test.setTimeout(120000);

  // 사용자 등록 (사전 조건)
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:5173/register');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="email"], input[type="email"]', testUser.email);
    await page.click('button:has-text("회원가입"), button:has-text("Register")');
    await page.waitForTimeout(1500);

    await context.close();
  });

  test('Desktop (1920x1080) 반응형 테스트', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // 로그인
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 스크린샷 저장
    await page.screenshot({
      path: './e2e/test-results/screenshots/responsive-desktop-1920x1080.png',
      fullPage: true
    });

    // 화면이 정상 표시되는지 확인
    const isVisible = await page.isVisible('body');
    expect(isVisible).toBeTruthy();

    console.log('✅ Desktop (1920x1080) 테스트 완료');

    await context.close();
  });

  test('Tablet (768x1024) 반응형 테스트', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
      viewport: { width: 768, height: 1024 }
    });
    const page = await context.newPage();

    // 로그인
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 스크린샷 저장
    await page.screenshot({
      path: './e2e/test-results/screenshots/responsive-tablet-768x1024.png',
      fullPage: true
    });

    // 화면이 정상 표시되는지 확인
    const isVisible = await page.isVisible('body');
    expect(isVisible).toBeTruthy();

    console.log('✅ Tablet (768x1024) 테스트 완료');

    await context.close();
  });

  test('Mobile (375x667) 반응형 테스트', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone SE'],
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();

    // 로그인
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 스크린샷 저장
    await page.screenshot({
      path: './e2e/test-results/screenshots/responsive-mobile-375x667.png',
      fullPage: true
    });

    // 화면이 정상 표시되는지 확인
    const isVisible = await page.isVisible('body');
    expect(isVisible).toBeTruthy();

    // 할일 추가 테스트 (모바일에서도 동작하는지)
    await page.click('button:has-text("할일 추가"), button:has-text("Add"), button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[name="title"], input[placeholder*="제목"]', '모바일 테스트 할일');
    await page.screenshot({
      path: './e2e/test-results/screenshots/responsive-mobile-add-todo.png',
      fullPage: true
    });
    await page.click('button:has-text("저장"), button:has-text("Save")');
    await page.waitForTimeout(1000);

    // 추가된 할일 확인
    const pageContent = await page.content();
    expect(pageContent).toContain('모바일 테스트 할일');

    console.log('✅ Mobile (375x667) 테스트 완료');
    console.log('');
    console.log('🎉 반응형 디자인 테스트 완료!');

    await context.close();
  });
});
