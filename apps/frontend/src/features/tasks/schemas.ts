import { z } from 'zod'

export const taskSchema = z.object({
    id: z.uuid().or(z.string()),
    title: z.string().min(1, 'タイトルを入力してください'),
    isCompleted: z.boolean().default(false),
    deadline: z.coerce.date(),
    evidenceUrl: z.url().nullable(),
    createdAt: z.coerce.date().optional(),
})

export type Task = z.infer<typeof taskSchema>
