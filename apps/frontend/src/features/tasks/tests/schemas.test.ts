import { describe, it, expect } from 'vitest'
import { taskSchema } from '@/features/tasks/schemas'

describe('taskSchema', () => {
    it('should validate a valid task object', () => {
        // Arrange
        const validTask = {
            id: '1',
            title: '毎日1時間プログラミング',
            isCompleted: false,
            deadline: '2026-01-30T19:00:00Z',
            evidenceUrl: null,
            createdAt: '2026-01-29T21:00:00Z',
        }

        // Act
        const result = taskSchema.safeParse(validTask)

        // Assert
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.deadline).toBeInstanceOf(Date)
            expect(result.data.createdAt).toBeInstanceOf(Date)
        }
    })

    it('should fail if title is empty', () => {
        // Arrange
        const invalidTask = {
            id: '1',
            title: '',
            isCompleted: false,
            deadline: '2026-01-30T19:00:00Z',
            evidenceUrl: null,
            createdAt: '2026-01-29T21:00:00Z',
        }

        // Act
        const result = taskSchema.safeParse(invalidTask)

        // Assert
        expect(result.success).toBe(false)
    })

    it('should fail if deadline is missing', () => {
        // Arrange
        const invalidTask = {
            id: '1',
            title: 'タイトル',
            isCompleted: false,
            evidenceUrl: null,
            createdAt: '2026-01-29T21:00:00Z',
        }

        // Act
        const result = taskSchema.safeParse(invalidTask)

        // Assert
        expect(result.success).toBe(false)
    })
})
