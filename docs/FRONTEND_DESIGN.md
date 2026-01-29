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
1. `page.tsx` (RSC) が `features/tasks/service.ts` のフェッチ関数を呼び出し、生データを取得する。
2. 取得した生データを、`schemas.ts` 等に定義された**バリデーション・トランスフォーマー関数**で評価し、型安全なドメインモデルに変換する。
3. これにより「通信の失敗」と「データ構造の不一致」を明確に分けて扱うことができる。

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
- **Vitest (Unit)**: ロジックや純粋関数のテスト。`vi.mock()` またはスタブを使用して、外部の依存関係（API通信等）を完全にモックし、ロジックそのものに集中する。**MSW はここでは使用しない。**
- **Playwright (E2E)**: ブラウザを介した統合テスト。ここでは **MSW (Browser)** を活用し、実際のネットワークリクエストを横取りして期待するレスポンスを返す。
