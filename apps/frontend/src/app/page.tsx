import { TaskList } from '@/features/tasks/components/TaskList'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

/**
 * トップページ: タスク一覧と煽りAIの要約を表示
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] font-sans selection:bg-zinc-200">
      <main className="max-w-4xl mx-auto pt-24 pb-32 px-6">
        {/* ヒーローセクション / 煽りAI */}
        <div className="mb-20 space-y-6">
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
            最速で、終わらせろ。<br />
            <span className="text-zinc-400 dark:text-zinc-600 italic font-medium text-3xl">Get it done, or get mocked.</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            AIがあなたの進捗を厳しく管理します。期限を過ぎれば容赦ない「煽り」が飛んできます。
            準備はいいですか？
          </p>
        </div>

        {/* メインコンテンツ: タスク一覧 */}
        <div className="grid gap-12">
          <section className="space-y-4">
            <Suspense fallback={<TaskListSkeleton />}>
              <TaskList />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  )
}

function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
