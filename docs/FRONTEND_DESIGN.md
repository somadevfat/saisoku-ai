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
│   │   ├── hooks/        # カスタムフック (Client Component 用)
│   │   │   └── tests/    # フックのテスト
│   │   ├── actions.ts    # Server Actions
│   │   ├── schemas.ts    # Zod スキーマ
│   │   ├── service.ts    # データ取得ロジック
│   │   ├── types.ts      # 型定義
│   │   └── tests/        # service, actions, schemas のテスト
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

## 5. TDD (Test-Driven Development) プロセス
- **Red**: 実装前に必ず失敗するテストを書く。
  - Logic/Service: `feature/**/test/*.test.ts` (Vitest)
  - UI/Workflow: `tests/e2e/*.spec.ts` (Playwright + MSW)
- **Green**: テストを通すための最小限の実装を行う。
- **Refactor**: 型の整理やコードの共通化を行い、テストが通る状態を維持する。

## 6. テスト戦略
- **Vitest (Unit/Service)**: 純粋関数、Zodバリデーション、Service層（データ取得）のロジック。
- **Playwright (E2E/Integration)**: 「タスク登録〜煽りリマインド〜完了報告」のハッピーパス。
- **Mocking**: 全てのテストにおいて MSW を使用し、常に再現性のある（不確定要素を排除した）状態で開発を進める。
