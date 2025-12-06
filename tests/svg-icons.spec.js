// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('SVG Icon Rendering', () => {
  test('should have sample SVG files available', async ({ page }) => {
    // sample_10.html 파일이 로드되는지 확인
    const response = await page.goto('/sample_10.html');
    expect(response?.status()).toBe(200);
  });

  test('should render SVG content in sample files', async ({ page }) => {
    await page.goto('/sample_10.html');

    // SVG 요소가 있는지 확인
    const svgElements = page.locator('svg');
    const count = await svgElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('all sample files should be accessible', async ({ page }) => {
    const sampleFiles = [
      'sample_10.html',
      'sample_20.html',
      'sample_30.html',
      'sample_40.html',
      'sample_50.html',
      'sample_60.html',
      'sample_70.html',
      'sample_80.html',
    ];

    for (const file of sampleFiles) {
      const response = await page.goto(`/${file}`);
      expect(response?.status(), `${file} should be accessible`).toBe(200);
    }
  });

  test('sample files should contain SVG elements', async ({ page }) => {
    const sampleFiles = [
      'sample_10.html',
      'sample_20.html',
      'sample_30.html',
    ];

    for (const file of sampleFiles) {
      await page.goto(`/${file}`);
      const svgCount = await page.locator('svg').count();
      expect(svgCount, `${file} should have SVG elements`).toBeGreaterThan(0);
    }
  });

  test('result screen should display crystal icon', async ({ page }) => {
    await page.goto('/');
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 결과 화면의 아이콘 컨테이너 확인
    const iconContainer = page.locator('#result-icon-container');
    await expect(iconContainer).toBeVisible();

    // 아이콘 컨테이너에 SVG가 렌더링되었는지 확인
    const svg = iconContainer.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('crystal icon should have proper dimensions', async ({ page }) => {
    await page.goto('/');
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    const iconContainer = page.locator('#result-icon-container');
    const box = await iconContainer.boundingBox();

    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('SVG icons should be visible against dark background', async ({ page }) => {
    await page.goto('/');
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    // 아이콘이 화면에 표시되는지 시각적으로 확인
    const iconContainer = page.locator('#result-icon-container');
    await expect(iconContainer).toBeVisible();

    // 아이콘 컨테이너가 충분한 크기를 가지는지 확인
    const box = await iconContainer.boundingBox();
    expect(box?.width).toBeGreaterThan(50);
    expect(box?.height).toBeGreaterThan(50);
  });
});

test.describe('Crystal Code Mapping', () => {
  test('result should show valid crystal code format', async ({ page }) => {
    await page.goto('/');
    await page.fill('#nickname-input', '테스터');
    await page.click('#start-btn');

    // 20 questions (OCEAN model)
    for (let i = 0; i < 20; i++) {
      await page.locator('#options-container .option-btn').first().click();
    }

    const resultCode = await page.locator('#result-code').textContent();

    // 코드 형식 확인 (예: N1a, P2b, C1c, H1 등)
    expect(resultCode).toMatch(/[NCPSDGIRH][0-9]?[a-z]?/);
  });
});
