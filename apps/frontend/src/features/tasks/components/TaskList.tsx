import { getTasks } from '../service'
import { validateTasks } from '../schemas'
import { TaskItem } from './TaskItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * サーバー側でタスク一覧を取得し、表示するサーバーコンポーネント (RSC)
 */
export async function TaskList() {
    // Act (Data Fetching)
    const rawData = await getTasks()

    // Act (Validation)
    const tasks = validateTasks(rawData)

    return (
        <Card className="w-full border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500 bg-clip-text text-transparent">
                    現在のタスク
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="px-6">
                    {tasks.length === 0 ? (
                        <p className="py-8 text-center text-zinc-500">タスクがありません。追加しましょう！</p>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                initialCompleted={task.isCompleted}
                                title={task.title}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
