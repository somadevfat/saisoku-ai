import { apiClient } from '@/lib/fetch-client'

/**
 * サーバー側からタスクの生データを取得する
 * 
 * @returns 検証前のタスクデータの配列
 * @throws ネットワークエラー発生時に Error を送出する
 */
export async function getTasks(): Promise<unknown[]> {
    return apiClient<unknown[]>('/api/tasks')
}
