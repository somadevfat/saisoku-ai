import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('*/api/tasks', () => {
        return HttpResponse.json([
            {
                id: '550e8400-e29b-41d4-a716-446655440000',
                title: '毎日1時間プログラミング',
                isCompleted: false,
                deadline: '2026-01-30T19:00:00Z',
                evidenceUrl: null,
                createdAt: '2026-01-29T21:00:00Z',
            },
        ])
    }),
]
