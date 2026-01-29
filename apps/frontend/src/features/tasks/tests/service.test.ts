import { describe, it, expect, vi } from 'vitest'
import { getTasks } from '../service'
import { apiClient } from '@/lib/fetch-client'

// apiClient をモック化
vi.mock('@/lib/fetch-client', () => ({
    apiClient: vi.fn(),
}))

describe('tasks service (タスクサービス)', () => {
    describe('getTasks', () => {
        it('タスク一覧を API から取得できること', async () => {
            // Arrange
            const mockRawTasks = [
                {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    title: 'テストタスク',
                },
            ]
            vi.mocked(apiClient).mockResolvedValueOnce(mockRawTasks)

            // Act
            const tasks = await getTasks()

            // Assert
            // Service は生データをそのまま返す責務
            expect(tasks).toEqual(mockRawTasks)
            expect(apiClient).toHaveBeenCalledWith('/api/tasks')
        })

        it('API エラーが発生した際に、そのエラーが伝播すること', async () => {
            // Arrange
            const apiError = new Error('Network Error')
            vi.mocked(apiClient).mockRejectedValueOnce(apiError)

            // Act & Assert
            await expect(getTasks()).rejects.toThrow('Network Error')
        })
    })
})
