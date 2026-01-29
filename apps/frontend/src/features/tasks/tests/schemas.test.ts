import { describe, it, expect } from 'vitest'
import { taskSchema, validateTask, validateTasks } from '@/features/tasks/schemas'

describe('taskSchema (タスクスキーマ)', () => {
    it('有効なタスクオブジェクトを検証できること', () => {
        // Arrange
        const validTask = {
            id: '550e8400-e29b-41d4-a716-446655440000',
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

    it('タイトルが空の場合にバリデーションエラーになること', () => {
        // Arrange
        const invalidTask = {
            id: '550e8400-e29b-41d4-a716-446655440000',
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

    it('期限 (deadline) が欠落している場合にバリデーションエラーになること', () => {
        // Arrange
        const invalidTask = {
            id: '550e8400-e29b-41d4-a716-446655440000',
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

describe('validateTask / validateTasks (バリデーション関数)', () => {
    it('validateTask が有効なデータを Task 型に変換すること', () => {
        // Arrange
        const raw = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            title: 'テスト',
            deadline: '2026-01-30T19:00:00Z',
            evidenceUrl: null,
        }

        // Act
        const task = validateTask(raw)

        // Assert
        expect(task.title).toBe('テスト')
        expect(task.deadline).toBeInstanceOf(Date)
    })

    it('validateTasks が配列データを Task[] 型に変換すること', () => {
        // Arrange
        const rawArray = [
            {
                id: '550e8400-e29b-41d4-a716-446655440000',
                title: 'テスト1',
                deadline: '2026-01-30T19:00:00Z',
                evidenceUrl: null,
            },
        ]

        // Act
        const tasks = validateTasks(rawArray)

        // Assert
        expect(tasks).toHaveLength(1)
        expect(tasks[0].deadline).toBeInstanceOf(Date)
    })
})
