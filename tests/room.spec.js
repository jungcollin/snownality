// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Room View', () => {
  test('should load room view when room parameter is present', async ({ page }) => {
    // 임의의 룸 ID로 접속 (실제 데이터 없이 UI 테스트)
    await page.goto('/?room=test-room-123');

    // 결과 화면이 표시되는지 확인 (room 모드)
    // room 파라미터가 있으면 바로 결과 화면이나 갤러리가 로드됨
    await page.waitForTimeout(1000); // 로딩 대기

    // 앱 컨테이너가 존재하는지 확인
    await expect(page.locator('.app-container')).toBeVisible();
  });

  test('should show gallery grid when room has data', async ({ page }) => {
    // 갤러리 그리드 요소가 존재하는지 확인
    await page.goto('/');

    // 갤러리 그리드 요소가 DOM에 존재하는지 확인
    const galleryGrid = page.locator('#gallery-grid');
    await expect(galleryGrid).toBeAttached();
  });

  test('should have room section in result screen', async ({ page }) => {
    await page.goto('/');

    // 퀴즈 완료 후 room 섹션이 있는지 확인
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 결과 화면에 room 관련 요소가 있는지 확인
    await expect(page.locator('#room-section')).toBeAttached();
    await expect(page.locator('#graph-container')).toBeAttached();
    await expect(page.locator('#graph-canvas')).toBeAttached();
  });

  test('should have graph canvas for relationship visualization', async ({ page }) => {
    await page.goto('/');
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 그래프 캔버스 확인
    const canvas = page.locator('#graph-canvas');
    await expect(canvas).toBeVisible();
  });

  test('should have room list container', async ({ page }) => {
    await page.goto('/');
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 룸 리스트 컨테이너 확인
    await expect(page.locator('#room-list')).toBeAttached();
  });

  test('should have advice modal in DOM', async ({ page }) => {
    await page.goto('/');

    // 조언 모달이 DOM에 존재하는지 확인 (초기에는 숨겨져 있음)
    const adviceModal = page.locator('#advice-modal');
    await expect(adviceModal).toBeAttached();
  });

  test('should allow view map before quiz', async ({ page }) => {
    await page.goto('/');

    // "관계도 먼저 보기" 버튼 확인
    const viewMapBtn = page.locator('#view-map-btn');
    await expect(viewMapBtn).toBeVisible();
    await expect(viewMapBtn).toContainText('관계도 먼저 보기');
  });
});

test.describe('Room URL handling', () => {
  test('should handle empty room parameter', async ({ page }) => {
    await page.goto('/?room=');

    // 빈 room 파라미터일 때 시작 화면이 표시되어야 함
    await expect(page.locator('#start-screen')).toBeVisible();
  });

  test('should preserve room context after quiz', async ({ page }) => {
    // room 파라미터와 함께 접속
    await page.goto('/?room=test-room');

    // 시작 화면이 보이면 퀴즈 진행
    const startScreen = page.locator('#start-screen');
    if (await startScreen.isVisible()) {
      await page.fill('#nickname-input', '테스터');
      await page.click('#start-btn');

      // 20 questions (OCEAN model)
      for (let i = 0; i < 20; i++) {
        await page.locator('#options-container .option-btn').first().click();
      }
    }

    // URL에 room 파라미터가 유지되는지 확인
    expect(page.url()).toContain('room=test-room');
  });
});
