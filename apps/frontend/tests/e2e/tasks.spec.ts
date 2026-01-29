import { test, expect } from '@playwright/test'

test.describe('タスク管理機能', () => {
    test('トップページにアクセスした際、タスク一覧が表示されること', async ({ page }) => {
        // Arrange
        // モックデータは MSW (handlers.ts) で定義されている前提

        // Act
        await page.goto('/')

        // Assert
        // 初期表示として期待されるタスクタイトル（handlers.ts の初期値など）を確認
        const taskTitle = page.getByText('毎日1時間プログラミング')
        await expect(taskTitle).toBeVisible()
    })
})
