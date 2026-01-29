export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_MOCKING === 'enabled') {
        const { server } = await import('./testing/mocks/server')
        server.listen({ onUnhandledRequest: 'bypass' })
    }
}
