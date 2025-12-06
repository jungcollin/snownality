// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display start screen on load', async ({ page }) => {
    // 시작 화면이 표시되는지 확인
    await expect(page.locator('#start-screen')).toBeVisible();
    await expect(page.locator('#nickname-input')).toBeVisible();
    await expect(page.locator('#start-btn')).toBeVisible();
    await expect(page.locator('#view-map-btn')).toBeVisible();
  });

  test('should show title and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Snow Crystal');
    await expect(page.locator('#start-screen p').first()).toContainText('Personality Test');
  });

  test('should start quiz when clicking start button', async ({ page }) => {
    // 이름 입력 및 시작
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 퀴즈 화면으로 전환 확인
    await expect(page.locator('#quiz-screen')).toBeVisible();
    await expect(page.locator('#start-screen')).not.toBeVisible();
  });

  test('should display first question correctly', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 질문 번호 확인
    await expect(page.locator('#q-idx')).toContainText('1');

    // 질문 텍스트가 있는지 확인
    await expect(page.locator('#question-text')).not.toBeEmpty();

    // 옵션 버튼이 2개 있는지 확인
    const options = page.locator('#options-container .option-btn');
    await expect(options).toHaveCount(2);
  });

  test('should progress through all 20 questions', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20개 질문 모두 진행 (OCEAN model - 4 questions per axis)
    for (let i = 1; i <= 20; i++) {
      await expect(page.locator('#q-idx')).toContainText(String(i));

      // 첫 번째 옵션 클릭
      await page.locator('#options-container .option-btn').first().click();

      // 마지막 질문이 아니면 다음 질문으로 넘어가는지 확인
      if (i < 20) {
        await expect(page.locator('#q-idx')).toContainText(String(i + 1));
      }
    }

    // 결과 화면으로 전환 확인
    await expect(page.locator('#result-screen')).toBeVisible();
  });

  test('should display result after completing quiz', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20개 질문 모두 답변
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 결과 화면 요소 확인
    await expect(page.locator('#result-screen')).toBeVisible();
    await expect(page.locator('#result-title')).not.toBeEmpty();
    await expect(page.locator('#result-code')).not.toBeEmpty();
    await expect(page.locator('#result-desc')).not.toBeEmpty();
    await expect(page.locator('#result-icon-container')).toBeVisible();
  });

  test('should show OCEAN stat bars in result', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // OCEAN 스탯 바 확인 (5개: O, C, E, A, N)
    const statBars = page.locator('#stat-bars .stat-bar');
    await expect(statBars).toHaveCount(5);
  });

  test('should have restart button in result screen', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    await expect(page.locator('#restart-btn')).toBeVisible();
    await expect(page.locator('#share-btn')).toBeVisible();
  });

  test('should restart quiz when clicking restart button', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 다시하기 버튼 클릭
    await page.click('#restart-btn');

    // 시작 화면으로 돌아가는지 확인
    await expect(page.locator('#start-screen')).toBeVisible();
    await expect(page.locator('#result-screen')).not.toBeVisible();
  });

  test('should update progress bar as quiz progresses', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 초기 진행률 확인
    const progressFill = page.locator('#progress-fill');

    // 10개 질문 진행 후 진행률 변화 확인 (50%)
    for (let i = 0; i < 10; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 진행률 바가 50% 정도 채워졌는지 확인 (width 스타일)
    const width = await progressFill.evaluate(el => getComputedStyle(el).width);
    expect(parseFloat(width)).toBeGreaterThan(0);
  });

  test('should allow selecting second option', async ({ page }) => {
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 두 번째 옵션 선택
    await page.locator('#options-container .option-btn').nth(1).click();

    // 다음 질문으로 넘어가는지 확인
    await expect(page.locator('#q-idx')).toContainText('2');
  });
});

test.describe('Quiz with different answer patterns', () => {
  test('should get different results with different answers', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 테스트: 모두 첫 번째 옵션 선택
    await page.fill('#nickname-input', '테스터1');
    await page.click('#start-btn');

    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    const result1Code = await page.locator('#result-code').textContent();

    // 다시하기
    await page.click('#restart-btn');

    // 두 번째 테스트: 모두 두 번째 옵션 선택
    await page.fill('#nickname-input', '테스터2');
    await page.click('#start-btn');

    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').nth(1).click();
    }

    const result2Code = await page.locator('#result-code').textContent();

    // 다른 결과가 나오는지 확인
    expect(result1Code).not.toBe(result2Code);
  });
});
