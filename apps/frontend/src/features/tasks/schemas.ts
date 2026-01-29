import { z } from 'zod'

/**
 * タスクの基本構造を定義する Zod スキーマ
 * API レスポンスの検証や型生成に使用する
 */
export const taskSchema = z.object({
    id: z.uuid().or(z.string()),
    title: z.string().min(1, 'タイトルを入力してください'),
    isCompleted: z.boolean().default(false),
    deadline: z.coerce.date(),
    evidenceUrl: z.url().nullable(),
    createdAt: z.coerce.date().optional(),
})

/**
 * タスクオブジェクトの TypeScript 型
 */
export type Task = z.infer<typeof taskSchema>

/**
 * 単一のデータをタスクモデルとしてバリデーション・変換する
 * 
 * @param data - 検証対象の生データ
 * @returns 検証済みの Task オブジェクト
 * @throws バリデーションエラー発生時に ZodError を送出する
 */
export function validateTask(data: unknown): Task {
    return taskSchema.parse(data)
}

/**
 * データの配列をタスクモデルの配列としてバリデーション・変換する
 * 
 * @param data - 検証対象の生データの配列
 * @returns 検証済みの Task オブジェクトの配列
 * @throws バリデーションエラー発生時に ZodError を送出する
 */
export function validateTasks(data: unknown): Task[] {
    return z.array(taskSchema).parse(data)
}
