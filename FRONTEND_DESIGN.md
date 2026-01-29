# フロントエンド詳細設計 - Saisoku-AI (Next.js Native Edition)

App Routerの「サーバー中心」設計を極限まで突き詰め、クライアントサイドのライブラリとJSを最小限にするモダン設計。

## 1. 構成方針: "Next-Native & Lean"
- **RSC-First**: 全てのコンポーネントをデフォルトで Server Components とし、`use client` は「葉」のコンポーネント（ボタン、フォームなど）にのみ限定。
- **Progressive Enhancement**: JSがロードされる前でも動作するよう、`form` と `Server Actions` を基本とする。
- **Zero Client Cache**: TanStack Query / Redux 等のクライアントキャッシュは廃止。Next.js 標準の Data Cache / Full Route Cache を活用。

## 2. ディレクトリ構成

```text
src/
├── app/                  # ルーティング & RSC
│   ├── (auth)/           # 認証済みパス
│   ├── (public)/         # 公開パス
│   └── actions/          # アプリ全体の共通 Server Actions
├── components/           # 汎用UI（shadcn/ui ベース）
│   └── ui/               # 完全にステートレスな部品
├── features/             # ドメインロジック（機能単位）
│   ├── tasks/
│   │   ├── components/   # タスク固有の Server/Client Components
│   │   ├── actions.ts    # この機能に関連する Server Actions
│   │   ├── schemas.ts    # Zod スキーマ（Client/Server 共通）
│   │   ├── service.ts    # データ取得ロジック（RSC から呼び出す）
│   │   └── types.ts      # 型定義
│   └── reminders/
├── lib/                  # 共通ライブラリ設定 (supabase, msw)
└── utils/                # 純粋関数（テスト対象）
```

## 3. 技術スタック

- **Framework**: Next.js 15+ (App Router)
- **Runtime**: Bun
- **Styling**: Tailwind CSS / shadcn/ui
- **Data Fetching**: Native `fetch` (inside RSC / Services)
- **Data Mutation**: Server Actions
- **Validation**: Zod
- **Optimization**: `useOptimistic`, `useTransition` (React標準フック)
- **Testing**:
  - Logic: Vitest
  - E2E: Playwright + MSW (Service Workerによる API Mock)

## 4. データ連携フロー

### 4.1 取得 (Read)
1. `page.tsx` (RSC) が `features/tasks/service.ts` の関数を呼び出す。
2. 関数内では `fetch` を使用（Next.js のキャッシュオプションを指定）。
3. 取得したデータを `Server Component` に Prop で渡す。

### 4.2 更新 (Write)
1. クライアントの `form` から `Server Action` を呼び出す。
2. Action 内で Zod バリデーションを実行。
3. 成功後、リポジトリ層（Supabase等）を更新。
4. `revalidatePath` を呼び出し、サーバーキャッシュを無効化して画面を自動更新。

## 5. テスト戦略
- **Vitest (Service/Logic)**: `service.ts` や `utils/` をテスト。API 通信が発生する部分は、`msw/node` を使用してネットワークレベルでモックし、本物の DB や外部 API には一切接続しない。
- **Playwright (E2E)**: `msw/browser` を活用。UI 上での操作（タスク登録、完了報告等）から Server Actions 経由の通信まで、ブラウザ内 Service Worker で完全にモックされた環境でテストを実行。
- **原則**: 全てのテスト環境において本物のデータベースは使用せず、定義した MSW ハンドラーを唯一のソースとして扱う（Backend-Agnostic な開発）。
