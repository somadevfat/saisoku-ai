'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

/**
 * タスク単体の表示と完了状態の操作を担当するクライアントコンポーネント
 * 
 * @param id - タスクID
 * @param initialCompleted - 初期完了状態
 * @param title - タスクのタイトル
 */
interface TaskItemProps {
    id: string
    initialCompleted: boolean
    title: string
}

export function TaskItem({ initialCompleted, title }: TaskItemProps) {
    const [isCompleted, setIsCompleted] = useState(initialCompleted)

    // TODO: Server Action を呼び出して DB を更新する
    const handleToggle = () => {
        setIsCompleted(!isCompleted)
    }

    return (
        <div className="flex items-center space-x-3 py-4 border-b last:border-0 border-zinc-100 dark:border-zinc-800">
            <Checkbox
                id={`task-${title}`}
                checked={isCompleted}
                onCheckedChange={handleToggle}
                className="w-5 h-5"
            />
            <label
                htmlFor={`task-${title}`}
                className={`text-base font-medium transition-all cursor-pointer ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-100'
                    }`}
            >
                {title}
            </label>
        </div>
    )
}
