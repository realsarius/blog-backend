import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3003';

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('should display loading state and then blogs', async ({ page }) => {
    await expect(page.getByText('Loading blogs...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sort Blogs' })).toBeVisible();
  });

  test('should open and close the blog form', async ({ page }) => {
    const addButton = page.getByRole('button', { name: 'add new blog' });
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(page.getByRole('button', { name: 'Add Blog' })).toBeVisible();
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await cancelButton.click();
    await expect(addButton).toBeVisible();
  });

  test('should remove a blog when remove button is clicked', async ({ page }) => {
    const removeButtons = await page.getByRole('button', { name: /remove/i });
    if (await removeButtons.count() > 0) {
      await removeButtons.first().click();
      await expect(removeButtons.first()).not.toBeVisible();
    }
  });
});
