// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 시나리오 6.1: 신규 사용자 전체 플로우 (Cold Start)
 *
 * 관련 문서: docs/3-user-scenario.md
 * 기능: F-001, F-002, F-101, F-102, F-103, F-104, F-105
 *
 * 테스트 단계:
 * 1. 회원가입
 * 2. 로그인
 * 3. 할일 3개 추가
 * 4. 첫 번째 할일 완료 처리
 * 5. 두 번째 할일 수정
 * 6. 세 번째 할일 삭제
 * 7. 로그아웃
 * 8. 재로그인 후 데이터 유지 확인
 */

// 랜덤 사용자명 생성 (중복 방지)
const timestamp = Date.now();
const testUser = {
  username: `test_user_${timestamp}`,
  password: 'TestPassword123!',
  email: `test_${timestamp}@example.com`
};

test.describe('신규 사용자 전체 플로우', () => {
  test.setTimeout(120000); // 2분 타임아웃

  test('Step 1: 회원가입 성공', async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto('/register');
    await expect(page).toHaveTitle(/my-todolist/i);

    // 회원가입 폼 입력
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="email"], input[type="email"]', testUser.email);

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/01-register-form.png' });

    // 회원가입 버튼 클릭
    await page.click('button:has-text("회원가입"), button:has-text("Register")');

    // 로딩 대기
    await page.waitForTimeout(1000);

    // 로그인 페이지로 이동했는지 또는 자동 로그인 되었는지 확인
    const currentUrl = page.url();
    const isLoginOrTodos = currentUrl.includes('/login') || currentUrl.includes('/todos');
    expect(isLoginOrTodos).toBeTruthy();

    console.log('✅ Step 1 완료: 회원가입 성공');
  });

  test('Step 2: 로그인 성공', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/login');

    // 로그인 폼 입력
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/02-login-form.png' });

    // 로그인 버튼 클릭
    await page.click('button:has-text("로그인"), button:has-text("Login")');

    // 할일 목록 페이지로 이동 대기
    await page.waitForURL(/\/todos/, { timeout: 5000 });

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/03-todos-empty.png' });

    // 사용자명 표시 확인
    const pageContent = await page.content();
    const hasUsername = pageContent.includes(testUser.username) ||
                       pageContent.includes('님') ||
                       pageContent.includes('환영');
    expect(hasUsername).toBeTruthy();

    console.log('✅ Step 2 완료: 로그인 성공');
  });

  test('Step 3: 할일 3개 추가', async ({ page }) => {
    // 로그인 (사전 조건)
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });

    // 할일 1 추가 (제목만)
    await page.click('button:has-text("할일 추가"), button:has-text("Add"), button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[name="title"], input[placeholder*="제목"], input[placeholder*="Title"]', '테스트 할일 1');
    await page.screenshot({ path: './e2e/test-results/screenshots/04-add-todo-1.png' });
    await page.click('button:has-text("저장"), button:has-text("Save")');
    await page.waitForTimeout(1000);

    // 할일 2 추가 (제목 + 설명)
    await page.click('button:has-text("할일 추가"), button:has-text("Add"), button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[name="title"], input[placeholder*="제목"], input[placeholder*="Title"]', '테스트 할일 2');
    await page.fill('textarea[name="description"], textarea[placeholder*="설명"], textarea[placeholder*="Description"]', '할일 2의 상세 설명');
    await page.screenshot({ path: './e2e/test-results/screenshots/05-add-todo-2.png' });
    await page.click('button:has-text("저장"), button:has-text("Save")');
    await page.waitForTimeout(1000);

    // 할일 3 추가 (제목 + 설명 + 마감일)
    await page.click('button:has-text("할일 추가"), button:has-text("Add"), button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[name="title"], input[placeholder*="제목"], input[placeholder*="Title"]', '테스트 할일 3');
    await page.fill('textarea[name="description"], textarea[placeholder*="설명"], textarea[placeholder*="Description"]', '할일 3의 상세 설명');

    // 마감일 설정 (내일 날짜)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"], input[name="dueDate"]', dateString);

    await page.screenshot({ path: './e2e/test-results/screenshots/06-add-todo-3.png' });
    await page.click('button:has-text("저장"), button:has-text("Save")');
    await page.waitForTimeout(1000);

    // 할일 목록 스크린샷
    await page.screenshot({ path: './e2e/test-results/screenshots/07-todos-list-3-items.png' });

    // 3개 할일이 표시되는지 확인
    const pageContent = await page.content();
    expect(pageContent).toContain('테스트 할일 1');
    expect(pageContent).toContain('테스트 할일 2');
    expect(pageContent).toContain('테스트 할일 3');

    console.log('✅ Step 3 완료: 할일 3개 추가 성공');
  });

  test('Step 4: 첫 번째 할일 완료 처리', async ({ page }) => {
    // 로그인 (사전 조건)
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 첫 번째 할일 찾기
    const firstTodo = page.locator('text=테스트 할일 1').first();
    await expect(firstTodo).toBeVisible();

    // 체크박스 클릭 (완료 처리)
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await page.waitForTimeout(1000);

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/08-todo-completed.png' });

    // 완료된 할일 확인 (취소선 또는 체크박스 체크)
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBeTruthy();

    console.log('✅ Step 4 완료: 할일 완료 처리 성공');
  });

  test('Step 5: 두 번째 할일 수정', async ({ page }) => {
    // 로그인 (사전 조건)
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 두 번째 할일의 수정 버튼 찾기
    const todoItems = page.locator('text=테스트 할일 2').first();
    await expect(todoItems).toBeVisible();

    // 수정 버튼 클릭
    const editButton = todoItems.locator('..').locator('button:has-text("수정"), button:has-text("Edit")').first();
    await editButton.click();
    await page.waitForTimeout(500);

    // 설명 수정
    const descriptionField = page.locator('textarea[name="description"], textarea[placeholder*="설명"]');
    await descriptionField.fill('할일 2의 수정된 설명입니다');

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/09-edit-todo.png' });

    // 저장 버튼 클릭
    await page.click('button:has-text("저장"), button:has-text("Save")');
    await page.waitForTimeout(1000);

    // 수정된 내용 확인
    await page.screenshot({ path: './e2e/test-results/screenshots/10-todo-edited.png' });
    const pageContent = await page.content();
    expect(pageContent).toContain('수정된 설명');

    console.log('✅ Step 5 완료: 할일 수정 성공');
  });

  test('Step 6: 세 번째 할일 삭제', async ({ page }) => {
    // 로그인 (사전 조건)
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 세 번째 할일 찾기
    const thirdTodo = page.locator('text=테스트 할일 3').first();
    await expect(thirdTodo).toBeVisible();

    // 삭제 버튼 클릭
    const deleteButton = thirdTodo.locator('..').locator('button:has-text("삭제"), button:has-text("Delete")').first();
    await deleteButton.click();
    await page.waitForTimeout(500);

    // 삭제 확인 다이얼로그 스크린샷
    await page.screenshot({ path: './e2e/test-results/screenshots/11-delete-confirm.png' });

    // 확인 버튼 클릭
    await page.click('button:has-text("삭제"):not(:has-text("취소"))');
    await page.waitForTimeout(1000);

    // 삭제 후 스크린샷
    await page.screenshot({ path: './e2e/test-results/screenshots/12-todo-deleted.png' });

    // 세 번째 할일이 사라졌는지 확인
    const pageContent = await page.content();
    const stillExists = pageContent.includes('테스트 할일 3');
    expect(stillExists).toBeFalsy();

    console.log('✅ Step 6 완료: 할일 삭제 성공');
  });

  test('Step 7: 로그아웃', async ({ page }) => {
    // 로그인 (사전 조건)
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 로그아웃 버튼 클릭
    await page.click('button:has-text("로그아웃"), button:has-text("Logout")');
    await page.waitForTimeout(1000);

    // 로그인 페이지로 이동했는지 확인
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/13-logged-out.png' });

    console.log('✅ Step 7 완료: 로그아웃 성공');
  });

  test('Step 8: 재로그인 후 데이터 유지 확인', async ({ page }) => {
    // 재로그인
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="사용자"], input[placeholder*="Username"]', testUser.username);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.click('button:has-text("로그인"), button:has-text("Login")');
    await page.waitForURL(/\/todos/, { timeout: 5000 });
    await page.waitForTimeout(1000);

    // 스크린샷 저장
    await page.screenshot({ path: './e2e/test-results/screenshots/14-relogin-data-persist.png' });

    // 데이터 유지 확인
    const pageContent = await page.content();

    // 할일 1, 2는 남아있고, 3은 삭제됨
    expect(pageContent).toContain('테스트 할일 1');
    expect(pageContent).toContain('테스트 할일 2');

    const stillHasTodo3 = pageContent.includes('테스트 할일 3');
    expect(stillHasTodo3).toBeFalsy();

    // 완료된 할일 1 확인
    const checkbox = page.locator('input[type="checkbox"]').first();
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBeTruthy();

    console.log('✅ Step 8 완료: 재로그인 후 데이터 유지 확인 성공');
    console.log('');
    console.log('🎉 신규 사용자 전체 플로우 테스트 완료!');
  });
});
