import { http, HttpResponse } from 'msw'

export const handlers = [
    // ここに各機能のモックAPIを追記していく
    http.get('/api/health', () => {
        return HttpResponse.json({ status: 'ok' })
    }),
]
