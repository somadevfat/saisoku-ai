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
    // NEXT_PUBLIC_API_URL が未定義の場合は相対パスとして扱う
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

    // URL の組み立て
    const url = baseUrl
        ? `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
        : endpoint

    const response = await fetch(url, {
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
