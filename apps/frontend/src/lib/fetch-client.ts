/**
 * Next.js ネイティブの fetch をラップした型安全な API クライアント
 * 
 * @param endpoint - リクエスト先の終端パス (例: '/api/tasks')
 * @param options - fetch のオプション (メソッド、ヘッダー、キャッシュ設定等)
 * @returns レスポンスデータの Promise
 * @throws API エラー発生時に適宜 Error を送出する
 */
export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}
